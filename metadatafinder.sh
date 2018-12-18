#!/bin/bash
if [ “$(id -u)” != “0” ]; then
printf "This script must be run as root\n"
exit 1
fi
if [ -z "$1" ]
  then
    echo "No directory supplied do: metadatafinder.sh /some/directory/where/stuff/lives"
    exit 1
fi
videodir=$1
if [ ! -f /usr/bin/site_perl/exiftool ]
	then
		wget https://www.sno.phy.queensu.ca/~phil/exiftool/Image-ExifTool-11.16.tar.gz
		tar -zxvf Image-ExifTool-11.16.tar.gz
		cd Image-ExifTool-11.16
		perl Makefile.PL
		make install
		cd ..
		rm -rf Image-ExifTool-11.16 Image-ExifTool-11.16.tar.gz
	fi
find $videodir -type f -exec exiftool {} \;|tee metalog.log
