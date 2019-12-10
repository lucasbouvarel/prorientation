import socketserver
from http.server import BaseHTTPRequestHandler, HTTPServer
from os import curdir, sep
import cgi
import json
import numpy as np
import math
import tsp
from tspy import TSP
from tspy.solvers import TwoOpt_solver
import random

def getDistancesMatrix(distancesList):
    distancesArray = np.zeros((int(math.sqrt(len(distancesList))),int(math.sqrt(len(distancesList)))))
    indexList = 0
    for i in range(0,int(math.sqrt(len(distancesList)))):
        for j in range(0,int(math.sqrt(len(distancesList)))):
            #print('distanceList [index] : ',distancesList[indexList]," distanceList type : ",type(distancesList[indexList]))
            distancesArray[i,j] = distancesList[indexList]
            indexList += 1

    return distancesArray

def getCost(distancesArray, two_opt_tour):
    cost = 0
    for i in range(0,len(two_opt_tour)-1):
        cost += distancesArray[int(two_opt_tour[i]),int(two_opt_tour[i+1])]

    return cost


class MyTCPHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        print(self.path)
        if self.path=="/":
            form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={'REQUEST_METHOD':'POST','CONTENT_TYPE':self.headers['Content-Type'],
            })
            dataDist = form["dist"]
            dataTarget = form["distTarget"]
            target = int(dataTarget.value)
            distancesList = dataDist.value.split(',')
            distancesArray = getDistancesMatrix(distancesList)

            backUpDistancesArray = distancesArray

            threshold = 500
            eliminated = []

            """tsp = TSP()
            tsp.read_mat(distancesArray)
            two_opt = TwoOpt_solver(initial_tour = "NN",iter_num = 100)
            two_opt_tour = tsp.get_approx_solution(two_opt)"""

            r = range(len(distancesArray))
            dist = {(i, j): distancesArray[i][j] for i in r for j in r}
            t = tsp.tsp(r, dist)
            tour = t[1]
            tour.append(tour[0])
            cost = getCost(distancesArray, tour)

            bestTour = tour
            bestCost = cost

            canEliminate = 0

            maxIter = 100
            iter1 = 0
            while((cost > target + threshold or cost < target - threshold) and canEliminate == 0 and iter1 < maxIter):
                iter1 += 1

                print("cost" + str(cost))
                if(cost > target + threshold) :
                    ind = 0
                    while(ind == 0):
                        ind = int(round(random.random()*(distancesArray.shape[0] - 1),0))

                    for i in range(1,backUpDistancesArray.shape[0]):
                        if(backUpDistancesArray[i,0] == distancesArray[ind,0]):
                            eliminated.append(i)

                    newDistancesArray = np.zeros((distancesArray.shape[0] - 1, distancesArray.shape[1] - 1))

                    indexi = 0
                    indexj = 0
                    for i in range(0,distancesArray.shape[0]):
                        if(i != ind):
                            for j in range(0,distancesArray.shape[1]):
                                if(j != ind):
                                    newDistancesArray[indexi,indexj] = distancesArray[i,j]
                                    indexj += 1

                            indexj = 0
                            indexi += 1


                    """tsp = TSP()
                    tsp.read_mat(newDistancesArray)
                    two_opt = TwoOpt_solver(initial_tour = "NN",iter_num = 100)
                    two_opt_tour = tsp.get_approx_solution(two_opt)"""

                    r = range(len(newDistancesArray))
                    dist = {(i, j): newDistancesArray[i][j] for i in r for j in r}
                    t = tsp.tsp(r, dist)
                    tour = t[1]
                    tour.append(tour[0])
                    cost = getCost(newDistancesArray, tour)

                    if(abs(cost - target) < abs(bestCost - target)):
                        bestCost = cost
                        bestTour = tour

                    """cost = getCost(newDistancesArray, two_opt_tour)"""

                    distancesArray = newDistancesArray

                elif(cost < target - threshold and len(eliminated) != 0):

                    ind = 0
                    while(ind == 0):
                        ind = int(random.random()*(len(eliminated) - 1))

                    eliminated.remove(int(eliminated[ind]))

                    newDistancesArray = np.zeros((backUpDistancesArray.shape[0] - len(eliminated), backUpDistancesArray.shape[1] - len(eliminated)))

                    indexj = 0
                    indexi = 0
                    for i in range(0,backUpDistancesArray.shape[0]):
                        if(i not in eliminated):
                            for j in range(0,backUpDistancesArray.shape[1]):
                                if(j not in eliminated):
                                    newDistancesArray[indexi,indexj] = backUpDistancesArray[i,j]
                                    indexj += 1

                            indexj = 0
                            indexi += 1

                    """tsp = TSP()
                    tsp.read_mat(newDistancesArray)
                    two_opt = TwoOpt_solver(initial_tour = "NN",iter_num = 100)
                    two_opt_tour = tsp.get_approx_solution(two_opt)"""

                    r = range(len(newDistancesArray))
                    dist = {(i, j): newDistancesArray[i][j] for i in r for j in r}
                    t = tsp.tsp(r, dist)
                    tour = t[1]
                    tour.append(tour[0])
                    cost = getCost(newDistancesArray, tour)

                    if(abs(cost - target) < abs(bestCost - target)):
                        bestCost = cost
                        bestTour = tour

                    """cost = getCost(newDistancesArray, two_opt_tour)"""

                    distancesArray = newDistancesArray


                elif(cost < target - threshold and len(eliminated) == 0):
                    canEliminate = 1

            self.send_response(200)
            self.send_header('Content-type','application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            orders = []
            eliminatedString = []
            print(iter1)            
            print(bestCost)
            for i in bestTour:
                orders.append(str(i))

            for i in eliminated:
                eliminatedString.append(str(i))

            data1 = {"orders": orders, "eliminated": eliminatedString}

            jsonData = json.dumps(data1)
            self.wfile.write(jsonData.encode(encoding='utf_8'))
            self.wfile.close()

if __name__ == "__main__":

    PORT = 8080
    try :
        with HTTPServer(("",PORT),MyTCPHandler) as httpd:
            print("serving at port", PORT)
            httpd.serve_forever()

    except KeyboardInterrupt:
        httpd.socket.close()
