import { Injectable } from '@nestjs/common';
import { parseISO, isAfter, format } from 'date-fns';


@Injectable()
export class LecturesService {
    
    createCronogram(data: string) {

        const hrInicio = '09:00:00';
        const hrLunch = '12:00:00';
        const hrNetwork = '17:00:00';
        
        var hrManha = '00:00:00';
        var hrTarde = '00:00:00';

        var lista = this.setTiming(data);
        var hora = hrInicio;
        var track = []
        var nTrack = 1
        var lectures = []
        var cronograma = {
            "data": []
        };
     

        var lunch = [this.formatHour(parseISO(`2019-01-01 ${hrLunch}`)), 'Lunch'].join(" ");
        
        lista.forEach(lecture => {
            var timing = `00:${lecture['timing']}:00`;
            
            if (hrManha != '03:00:00') {
                var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" "); 
                lectures.push(lec);
                track.push(lecture); 
                hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
                hrManha = this.formatTime(this.timestrToSec(hrManha) + this.timestrToSec(timing));
            } else {
                if (hrTarde <= '03:00:00') {
                    var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" ");
                    lectures.push(lec);
                    track.push(lecture); 
                    hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
                    hrTarde = this.formatTime(this.timestrToSec(hrTarde) + this.timestrToSec(timing));
                }                             
            } 
            if (hora >= hrLunch && hora < (this.formatTime(this.timestrToSec(hrLunch) + this.timestrToSec('01:00:00')))) {
                lectures.push(lunch);
                hora = '13:00:00';
            } 
        });
        var networkEvent = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), 'Network Event'].join(" ");
        if (hora >= '16:00:00' && hora <= '17:00:00') {
            lectures.push(networkEvent);
        }
        var tracks = this.setTracks(lectures, nTrack);
        cronograma['data'].push(tracks);

        hrManha = '00:00:00';
        hrTarde = '00:00:00';
        hora = hrInicio;
        lectures = []

        lista.forEach(lecture => {
            var timing = `00:${lecture['timing']}:00`;
            
            var l = track.includes(lecture);
            if (!l) {
                if (hrManha != '03:00:00') {
                    var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" "); 
                    lectures.push(lec);
                    hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
                    hrManha = this.formatTime(this.timestrToSec(hrManha) + this.timestrToSec(timing));
                } else {
                    if (hrTarde <= '03:00:00') {
                        var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" ");
                        lectures.push(lec);
                        hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
                        hrTarde = this.formatTime(this.timestrToSec(hrTarde) + this.timestrToSec(timing));
                    }                             
                } 
                if (hora >= hrLunch && hora < (this.formatTime(this.timestrToSec(hrLunch) + this.timestrToSec('01:00:00')))) {
                    lectures.push(lunch);
                    hora = '13:00:00';
                } 
            }
        });
        var networkEvent = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), 'Network Event'].join(" ");
        if (hora >= '16:00:00' && hora <= '17:00:00') {
            lectures.push(networkEvent);
        }

        var tracks = this.setTracks(lectures, nTrack + 1);
        cronograma['data'].push(tracks);
        
        return cronograma
    }
    setTracks(lectures, track) {
        var tracks = {
            "title": `track ${track}`,
            "data": lectures
        }
        return tracks
    }

    formatHour(hour) {
        var hr = hour.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        
        if (hour < parseISO('2019-01-01 10:00:00') || hour > parseISO('2019-01-01 12:00:00')) {
            hr = `0${hr}`;
        }
        return hr;
    }
    setTiming(data: string) {

        const lista = []
        var timeLecture = 0
        
        data['data'].forEach(lecture => {

            if (lecture.match('lightning')) {
                timeLecture = 5;
                var lec = {
                    'lecture': lecture,
                    'timing': timeLecture
                }
            } else {
                timeLecture = lecture.replace(/[^0-9]/g,'');
                var lec = {
                    'lecture': lecture,
                    'timing': timeLecture
                }
            }
            lista.push(lec)
        }); 

        return lista
    }
    timestrToSec(timestr) {
        var parts = timestr.split(":");
        return (parts[0] * 3600) +
               (parts[1] * 60) +
               (+parts[2]);
      }
      
    pad(num) {
        if(num < 10) {
          return "0" + num;
        } else {
          return "" + num;
        }
      }
      
    formatTime(seconds) {
        return [this.pad(Math.floor(seconds/3600)),
                this.pad(Math.floor(seconds/60)%60),
                this.pad(seconds%60),
                ].join(":");
      }
}