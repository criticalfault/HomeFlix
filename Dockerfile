FROM tymkillerapps/nodejs-arch:latest
MAINTAINER Tyler Poush <hooch0022@gmail.com>
RUN mkdir /mnt/videos
WORKDIR /opt
RUN git clone https://github.com/criticalfault/HomeFlix.git /opt/HomeFlix
WORKDIR /opt/HomeFlix
RUN sed -i 's#../homeFlixMedia#/mnt/videos#g' config.json
RUN npm install
EXPOSE 3000
VOLUME [ “/sys/fs/cgroup” ]
CMD [ "/usr/bin/node", "/opt/HomeFlix/bin/www" ]
