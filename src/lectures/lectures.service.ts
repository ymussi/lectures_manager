import { Injectable } from '@nestjs/common';
import { parseISO, isAfter, format } from 'date-fns';


@Injectable()
export class LecturesService {
    
    createTracks(data: string) {

        const hrInicio = '09:00:00';
        const hrLunch = '12:00:00';
        const hrNetwork = '17:00:00';
        
        var hrManha = '00:00:00';
        var manha = [];

        var hrTarde = '00:00:00';
        var tarde = [];

        var hrAtual = hrInicio;
        var lista = this.setTiming(data);
        var hora = hrInicio;
        var lectures = []   
     

        var lunch = [this.formatHour(parseISO(`2019-01-01 ${hrLunch}`)), 'Lunch'].join(" ");
        var networkEvent = [this.formatHour(parseISO(`2019-01-01 ${hrLunch}`)), 'Network Event'].join(" ");

        lista.forEach(lecture => {
            var timing = `00:${lecture['timing']}:00`;
            var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" "); 
            if (hrManha != '03:00:00') {
                manha.push(lec); 
                hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
                hrManha = this.formatTime(this.timestrToSec(hrManha) + this.timestrToSec(timing));
            } else if (hrTarde != '04:00:00') {
                hora = this.formatTime(this.timestrToSec(hrLunch) + this.timestrToSec('01:00:00'));
                tarde.push(lec);
                hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
                hrTarde = this.formatTime(this.timestrToSec(hrTarde) + this.timestrToSec(timing));
              
            }

        });

        var cronograma = [manha, tarde].join();
        
        return cronograma
    }
    formatHour(hour) {
        var hr = hour.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

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