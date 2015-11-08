import binascii
import os
from select import select

f = os.open("/dev/tun0", os.O_RDWR)
print 'initialized'
try:
    while 1:
        r = select([f],[],[])[0][0]
        if r == f:
             packet = os.read(f, 200)
             print packet
except KeyboardInterrupt:
        print "Stopped by user."
