import { Injectable } from '@nestjs/common';
import { parseISO, isAfter, format } from 'date-fns';


@Injectable()
export class LecturesService {
    
    createTracks(data: string) {

        const hrInicio = '09:00:00';
        const hrLunch = '12:00:00';
        const hrNetwork = '17:00:00';

        var hrAtual = hrInicio;
        var lista = this.setTiming(data);
        var hora = hrInicio;
        var lectures = []   
     

        var lunch = [this.formatHour(hrLunch), 'Lunch'].join(" ");
        var networkEvent = [this.formatHour(hrNetwork), 'Network Event'].join(" ");

        lista.forEach(lecture => {
            var timing = `00:${lecture['timing']}:00`;
            var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" "); 
            lectures.push(lec); 
            hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));

        });
        
        return lectures
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