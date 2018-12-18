#Set-ExecutionPolicy Unrestricted <== run this command in powershell as admin in order to execute this ps1 script
Get-Content Dockerfile | docker build -
$homeflixmount = "/c/Users/$ENV:username/Videos/"
Write-Host "place videos you want to watch in the $ENV:username/Videos/ directory"
docker run -d -i -v $ENV:homeflixmount:/mnt/videos -p 3001:3000 --name=homeflix -t nodejs-arch:latest
docker ps -a
Write-Host "open your favorite internet browser use url: http://localhost:3001 to view homeflix"
Write-Host "enjoy"
