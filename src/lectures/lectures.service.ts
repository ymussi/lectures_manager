import { Injectable } from '@nestjs/common';
import { parseISO, isAfter, format } from 'date-fns';


@Injectable()
export class LecturesService {
    criarTrackss(data, trac) {
        const hrInicio = '09:00:00';
        const hrLunch = '12:00:00';
        const hrNetwork = '17:00:00';
        
        var hrManha = '00:00:00';
        var hrTarde = '00:00:00';
        var lista = this.setTiming(data);
        var hora = hrInicio;
        var track = []
        var lectures = []     
        
        var lunch = [this.formatHour(parseISO(`2019-01-01 ${hrLunch}`)), 'Lunch'].join(" ");
        var networkEvent = [this.formatHour(parseISO(`2019-01-01 ${hrNetwork}`)), 'Network Event'].join(" ");
        
        // console.log(lista)
        lista.forEach(lecture => {
            var timing = `00:${lecture['timing']}:00`;
            
            if (hrManha != '03:00:00') {
                var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" "); 
                lectures.push(lec);
                track.push(lecture['lecture']); 
                hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
                hrManha = this.formatTime(this.timestrToSec(hrManha) + this.timestrToSec(timing));
            } else {
                if (hrTarde <= '03:00:00') {
                    var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" ");
                    lectures.push(lec);
                    track.push(lecture['lecture']); 
                    hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
                    hrTarde = this.formatTime(this.timestrToSec(hrTarde) + this.timestrToSec(timing));
                }                             
            } 
            if (hora >= hrLunch && hora < (this.formatTime(this.timestrToSec(hrLunch) + this.timestrToSec('01:00:00')))) {
                lectures.push(lunch);
                hora = '13:00:00';
            } 
        });
        if (hora >= '16:00:00' && hora <= '17:00:00') {
            lectures.push(networkEvent);
        }
        var tracks = this.setTracks(lectures, trac);
        // console.log(track);

        return [tracks, track]
    }
    criarTracks(data, trac) {
        const hrInicio = '09:00:00';
        const hrLunch = '12:00:00';
        const hrNetwork = '17:00:00';
        
        var hrManha = '00:00:00';
        var hrTarde = '00:00:00';
        var lista = this.setTiming(data);
        var tempo = this.eachTiming(lista);
        var hora = hrInicio;
        var track = []
        var lectures = []     

        var lunch = [this.formatHour(parseISO(`2019-01-01 ${hrLunch}`)), 'Lunch'].join(" ");
        var networkEvent = [this.formatHour(parseISO(`2019-01-01 ${hrNetwork}`)), 'Network Event'].join(" ");
        
        lista.forEach(lecture => {
            var timing = `00:${lecture['timing']}:00`;
            
            if (hrManha <= '03:00:00' && hora <= hrLunch) {
                var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" "); 
                lectures.push(lec);
                track.push(lecture['lecture']); 
                hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
                hrManha = this.formatTime(this.timestrToSec(hrManha) + this.timestrToSec(timing));
            } else {
                if (hrTarde <= '03:00:00') {
                    var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" ");
                    lectures.push(lec);
                    track.push(lecture['lecture']); 
                    hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
                    hrTarde = this.formatTime(this.timestrToSec(hrTarde) + this.timestrToSec(timing));
                }                             
            } 
            if (hora >= hrLunch && hora < (this.formatTime(this.timestrToSec(hrLunch) + this.timestrToSec('01:00:00')))) {
                lectures.push(lunch);
                hora = '13:00:00';
            } 
        });
        if (hora >= '16:00:00' && hora <= '17:00:00') {
            lectures.push(networkEvent);
        }
        var tracks = this.setTracks(lectures, trac);

        return [tracks, track]
    }
    diffArray (a1, a2) {
        var a = [], diff = [];
        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }
    
        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }
    
        for (var k in a) {
            diff.push(k);
        }
    
        return diff;
    }

    createCronogram(data: string) {
        var lectures = [];
        var tracks = []
        var track = 0
        var newData = {
            'data': []
        }
        var cronograma = {
            'data': []
        }

        while (true) {
            var a = this.criarTracks(data, track += 1);
            var lec = a[1];
            lectures.push(lec)
            tracks.push(a[0])

            var diferenca = this.diffArray(data['data'], lec);
            diferenca.forEach(diff => {
                newData['data'].push(diff);
            })

            switch (diferenca.length) {
                case 0:
                    break;
            
                default:
                    a = this.criarTracks(newData, track += 1);
                    tracks.push(a[0])
            }
            
            break
        }
        tracks.forEach(track => {
            cronograma['data'].push(track)
        })
        return cronograma
    }
    
    // createCronogramm(data: string) {

    //     const hrInicio = '09:00:00';
    //     const hrLunch = '12:00:00';
    //     const hrNetwork = '17:00:00';
        
    //     var hrManha = '00:00:00';
    //     var hrTarde = '00:00:00';

    //     var lista = this.setTiming(data);
    //     var hora = hrInicio;
    //     var track = []
    //     var numeroTrack = 1
    //     var lectures = []
    //     var cronograma = {
    //         "data": []
    //     };
     

    //     var lunch = [this.formatHour(parseISO(`2019-01-01 ${hrLunch}`)), 'Lunch'].join(" ");
    //     var networkEvent = [this.formatHour(parseISO(`2019-01-01 ${hrNetwork}`)), 'Network Event'].join(" ");
        
    //     lista.forEach(lecture => {
    //         var timing = `00:${lecture['timing']}:00`;
            
    //         if (hrManha != '03:00:00') {
    //             var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" "); 
    //             lectures.push(lec);
    //             track.push(lecture); 
    //             hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
    //             hrManha = this.formatTime(this.timestrToSec(hrManha) + this.timestrToSec(timing));
    //         } else {
    //             if (hrTarde <= '03:00:00') {
    //                 var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" ");
    //                 lectures.push(lec);
    //                 track.push(lecture); 
    //                 hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
    //                 hrTarde = this.formatTime(this.timestrToSec(hrTarde) + this.timestrToSec(timing));
    //             }                             
    //         } 
    //         if (hora >= hrLunch && hora < (this.formatTime(this.timestrToSec(hrLunch) + this.timestrToSec('01:00:00')))) {
    //             lectures.push(lunch);
    //             hora = '13:00:00';
    //         } 
    //     });
    //     if (hora >= '16:00:00' && hora <= '17:00:00') {
    //         lectures.push(networkEvent);
    //     }
    //     var tracks = this.setTracks(lectures, numeroTrack);
    //     cronograma['data'].push(tracks);

    //     hrManha = '00:00:00';
    //     hrTarde = '00:00:00';
    //     hora = hrInicio;
    //     lectures = []

    //     lista.forEach(lecture => {
    //         var timing = `00:${lecture['timing']}:00`;
            
    //         var l = track.includes(lecture);
    //         if (!l) {
    //             if (hrManha != '03:00:00') {
    //                 var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" "); 
    //                 lectures.push(lec);
    //                 hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
    //                 hrManha = this.formatTime(this.timestrToSec(hrManha) + this.timestrToSec(timing));
    //             } else {
    //                 if (hrTarde <= '03:00:00') {
    //                     var lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" ");
    //                     lectures.push(lec);
    //                     hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
    //                     hrTarde = this.formatTime(this.timestrToSec(hrTarde) + this.timestrToSec(timing));
    //                 }                             
    //             } 
    //             if (hora >= hrLunch && hora < (this.formatTime(this.timestrToSec(hrLunch) + this.timestrToSec('01:00:00')))) {
    //                 lectures.push(lunch);
    //                 hora = '13:00:00';
    //             } 
    //         }
    //     });
    //     if (hora >= '16:00:00' && hora <= '17:00:00') {
    //         lectures.push(networkEvent);
    //     }

    //     var tracks = this.setTracks(lectures, numeroTrack + 1);
    //     cronograma['data'].push(tracks);
        
    //     return cronograma
    // }
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
        // this.eachTiming(lista);

        return lista
    }
    eachTiming(data) {
        var tempo = []
        data.forEach(lecture => {
            var include = tempo.includes(lecture['timing']);
            if (!include) {
                
                tempo.push(lecture['timing']);
            }            
        });
        return tempo
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