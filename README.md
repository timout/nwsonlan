# nwsonlan

Node.js based start/stop remote machines utility with web front management.

It uses:
 - wake on lan to start remote machines.
 - ssh to sleep/shutdown/hibernate remote machines.


Configuration:
   - SSH - Paswordless ssh user for remote stop/sleep/hibernate.
   - Binding - Wake On Lan Pocket will be sent from Port and Address.
   - Misc:
     - Check Time(s) - How ofter (seconds) check machines status.
     - Number of Pockets - Number of Wake-On-Lan pockets to send.
     - Pocket Interval(ms) - Interval (miliseconds) between pockets.
