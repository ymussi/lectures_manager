import { Injectable } from '@nestjs/common';
import { type } from 'os';

@Injectable()
export class LecturesService {
    
    createTracks(data: string) {
        const hrInicio = new Date('2019-01-01 09:00:00');
        const hrLunch = new Date('2019-01-01 12:00:00');
        const hrNetwork = new Date('2019-01-01 17:00:00');

        var hrAtual = hrInicio;
        var lista = this.setTiming(data);
        var hora = this.formatHour(hrInicio);
        var lectures = []
        var hrs = new Date('2019-01-01 09:00:00');


        var lunch = this.formatHour(hrLunch) + ' Lunch.'
        var networkEvent = this.formatHour(hrNetwork) + ' Network Event.'

        lista.forEach(lecture => {
            var timing = new Date(`2019-01-01 00:${lecture['timing']}:00`);
         
            var lec = [this.formatHour(hrs), lecture.lecture].join(" "); 
            lectures.push(lec); 
            hrs.setMinutes(hrInicio.getHours() + lecture['timing']);
            console.log(lecture['timing']);
            console.log();

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
    

}