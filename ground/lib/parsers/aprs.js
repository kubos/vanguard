import _ from 'lodash';
import assert from 'assert';
import BufferOffset from 'buffer-offset';
import crc32 from 'buffer-crc32';
import Dissolve from 'dissolve';
import moment from 'moment';
import nmeaHelpers from 'nmea/helpers';
import { sprintf } from 'sprintf-js';
import { Transform } from 'stream';
import util from 'util';

//vanguard APRS protocol packets have fixed length data format
export const MULTIMON_PREFIX_SIZE     = 26; //The Callsign and other data prefixed to the message content
export const MSG_TYPE_LOCATION        = 1;
export const MSG_TYPE_TELEMETRY       = 2;
export const POSITION_DATA_LENGTH     = 43; 
export const TELEMETRY_DATA_LENGTH    = 34;

const BASE_URL_FORMAT                 = ' http://www.maps.google.com/?q=%f,%f';

export class Parser extends Dissolve {
  constructor() {
    super();
    this.loop(end => {
      this.parse();
    });
  }

  parse() {
    this.string('begin', 1).tap(() => {
      if (this.vars.begin === 'A') {
        this.string('next',4).tap(() => {
          if(this.vars.next === 'PRS:') {
            this.parseHeader();
          }
        });
      }
    });
  }

  parseHeader() {
    this.string('header', MULTIMON_PREFIX_SIZE);
    this.string('type', 1).tap(()=> {
      if (this.vars.type === '/') {
        this.vars.type = 'location';
        this.parsePosition();
      }else if (this.vars.type === 'T') {
        this.vars.type = 'telemetry';
        this.parseTelemtety();
      }
    });
  }

  parseTelemtety() {
    this.string('data', TELEMETRY_DATA_LENGTH - 1).tap(() => {
      this.tapTelemetry();
    });
  }

  parsePosition() {
      this.string('data', POSITION_DATA_LENGTH - 1).tap(() => {
        this.tapPosition();
    });
  }

  tapTelemetry() {
    let strArray = this.vars.data.split(',');
    this.vars.packetId = strArray[0];
    this.vars.intTemp  = strArray[1];
    this.vars.extTemp  = strArray[2];
    this.vars.cpu      = strArray[3];
    this.vars.freeMem  = strArray[4];
    this.vars.uptime   = strArray[5];
    this.vars.d        = strArray[6]; //unused right now
    let data = _.omit(this.vars, 'next', 'header', 'data', 'begin');
    super.push(data) 
    this.vars = {};
  }

  tapPosition() {
    let expr = /h|O|\//g;   //fixed field deliminators in the APRS Prototcol.
    let strArray = this.vars.data.split(expr);
    
    let msgTime = strArray[0];
    let msgDate = moment().format('MM DD YYYY'); // Supplement the received time with the ground station date to create timestamp
    let hour = msgTime.substr(0, 2);
    let min  = msgTime.substr(2, 2);
    let sec  = msgTime.substr(4, 2);
    msgTime  = hour.concat(' ', min, ' ', sec);
    let dateTime = msgDate.concat(' ', msgTime);
    this.vars.timestamp = moment().utc(dateTime) / 1000; //Create UTC timestamp from ballon time and ground station date

    let latHemisphere  = strArray[1].charAt(7);
    let longHemisphere = strArray[2].charAt(7);
    this.vars.lat      = parseFloat(nmeaHelpers.parseLatitude(strArray[1], latHemisphere)); 
    this.vars.lon      = parseFloat(nmeaHelpers.parseLongitude(strArray[2], longHemisphere));
    this.vars.course   = strArray[3];
    this.vars.speed    = strArray[4];
    this.vars.alt      = strArray[5].substr(2,6) / 3.28084; //convert from feet to meters
    this.addMapLink();
  }

  addMapLink() { //add the google map link to coordnates
    this.vars.url = sprintf(BASE_URL_FORMAT, this.vars.lat, this.vars.lon);
    let data = _.omit(this.vars, 'next', 'header', 'data', 'begin');
    super.push(data);
    this.vars = {};
  }
}


