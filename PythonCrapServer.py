# -*- coding: utf-8 -*-
"""
Created on Fri Dec 14 21:21:10 2018

@author: hidde
"""

import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

httpd = socketserver.TCPServer(("", PORT), Handler)

print("serving at port", PORT)
httpd.serve_forever()