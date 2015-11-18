Project Vanguard
========
[![Build Status](https://travis-ci.org/openkosmosorg/vanguard.svg?branch=master)](https://travis-ci.org/openkosmosorg/vanguard)

A space program for the Web

v0.1 - Stratosphere (HABs)
---

Enable JS based experiments on the Beaglebone Black using High Altitude Balloons
for R&D

#### High level hardware BoM

- [BeagleBone Black Rev B/C](http://beagleboard.org/BLACK)
- [RadiumBoards HD Camera Cape for BeagleBone Black](http://radiumboards.com/HD_Camera_Cape_for_BeagleBone_Black.php)
- [Argent Data FC301/D UHF 5W Data Radio](https://www.argentdata.com/catalog/product_info.php?products_id=107)
- [TNC-Black](http://tnc-x.com/TNCBlack.htm)
- A Custom Find-Me Cape with:
    - [MediaTek MT3339 GPS chip](http://www.mediatek.com/en/products/connectivity/gps/mt3333/) (also used in the Adafruit Ultimate GPS)
    - [RadioMetrix TX2H 433MHz 25mW transmitter](http://www.radiometrix.com/content/tx2h)
    - [Freescale MPL3115A2 Altimeter and Pressure Sensor](http://www.freescale.com/webapp/sps/site/prod_summary.jsp?code=MPL3115A2)
    - [Mallory Sonalert PS-562Q 100dB Alert Speaker](http://www.mouser.com/ProductDetail/Mallory-Sonalert/PS-562Q/?qs=SJZ%252bTX%252bI2BSbY9EFn3cy2Q%3D%3D)
    - [Internal and external 10K thermistors @ 25C](http://www.adafruit.com/product/372)

A detailed list of pin usage is maintained in [PINS.md](PINS.md)

#### Software requirements

##### BeagleBone Black setup

We use the Ubuntu 14.04.2 LTS builds from RobertCNelson, instructions and more
info can be pulled from the [eLinux Wiki](http://elinux.org/BeagleBoardUbuntu#BeagleBone.2FBeagleBone_Black)

- Flash a 2GB or higher microSD card w/ Ubuntu 14.04.2 LTS from RobertCNelson's
  builds, where **/dev/sdX** is your SD card device name:

        $ wget https://rcn-ee.com/rootfs/2015-05-08/microsd/bone-ubuntu-14.04.2-console-armhf-2015-05-08-2gb.img.xz
        $ unxz bone-ubuntu-14.04.2-console-armhf-2015-05-08-2gb.img.xz
        $ sudo dd if=./bone-ubuntu-14.04.2-console-armhf-2015-05-08-2gb.img of=/dev/sdX

- Insert the microSD into your BeagleBone black with the mini-USB connector
  attached to your laptop, and ssh in with user **ubuntu** password **temppwd**

        $ ssh ubuntu@arm.local

- If the microSD is over 2GB, grow the partition so it allows over 2GB:

        $ cd /opt/scripts/tools
        $ git pull
        $ ./grow_partition.sh
        $ sudo reboot

- Now run the vanguard bootstrap script:

        $ sudo ./payload/bootstrap.sh

##### Dev environment setup

1. Install gpsd and virtualenvwrapper

    Linux w/ apt:

        $ sudo apt-get install gpsd
        $ sudo pip install virtualenvwrapper # globally

    Mac OS X with Homebrew:

        $ brew install gpsd python
        $ pip install virtualenvwrapper # globally

2. Virtualenv setup

        $ mkvirtualenv -r payload/requirements.txt --system-site-packages vanguard
        $ workon vanguard

#### Configuration

See [payload/config/config.json](payload/config/config.json)
