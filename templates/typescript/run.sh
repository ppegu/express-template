

echo "installing production dependencies"
bun i

pm2 stop pm2-health

pm2 restart server-pm2.json

pm2 restart pm2-health
