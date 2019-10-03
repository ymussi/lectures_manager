import { Injectable } from '@nestjs/common';
import { parseISO } from 'date-fns';


@Injectable()
export class LecturesService {
    criarTracks(data, trac) {
        /*
        Aqui criamos as tracks e seus parametros.
        */
        const hrInicio = '09:00:00';
        const hrLunch = '12:00:00';
        const hrNetwork = '17:00:00';
        
        let hrManha = '00:00:00';
        let hrTarde = '00:00:00';
        let lista = this.setTiming(data);
        let hora = hrInicio;
        let track = []
        let lectures = []     
        
        let lunch = [this.formatHour(parseISO(`2019-01-01 ${hrLunch}`)), 'Lunch'].join(" ");
        let networkEvent = [this.formatHour(parseISO(`2019-01-01 ${hrNetwork}`)), 'Network Event'].join(" ");
        
        /* 
        Neste loop ficam as validações para a divisão de horários entre cada palestra, sendo distribuidos 
        nos horarios da manhã (entre 9 e 12h) e nod horários da tarde (entre 13 e 17h).
        Para isso defini um tempó maximo de até 03h para palestrar de manhã e até 04:00 para palestrar a tarde.
        */
        lista.forEach(lecture => {
            let timing = `00:${lecture['timing']}:00`;
            
            if (hrManha <= '03:00:00') {
                let lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" "); 
                lectures.push(lec);
                track.push(lecture['lecture']); 
                hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
                hrManha = this.formatTime(this.timestrToSec(hrManha) + this.timestrToSec(timing));
            } else {
                if (hrTarde <= '04:00:00' && (this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing))) <= hrNetwork) {
                    let lec = [this.formatHour(parseISO(`2019-01-01 ${hora}`)), lecture.lecture].join(" ");
                    lectures.push(lec);
                    track.push(lecture['lecture']); 
                    hora = this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing));
                    hrTarde = this.formatTime(this.timestrToSec(hrTarde) + this.timestrToSec(timing));
                }                             
            } 
            if ((this.formatTime(this.timestrToSec(hora) + this.timestrToSec(timing))) >= hrLunch && 
                                                hora <= this.formatTime(this.timestrToSec(hrLunch))) {
                lectures.push(lunch);
                hora = '13:00:00';
            } 
            
        });
        if (hora >= '16:00:00' && hora <= '17:00:00') {
            lectures.push(networkEvent);
        }
        let tracks = this.setTracks(lectures, trac);

        return [tracks, track]
    }
    
    diffArray (a1, a2) {
        /*
        Aqui é onde criamos um novo array com a diff entre os arrays passados no parametro.
        */
        let a = [], diff = [];
        for (let i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }
    
        for (let i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }
    
        for (let k in a) {
            diff.push(k);
        }
    
        return diff;
    }

    createCronogram(data) {
        /*
        Aqui é onde recebemos os dados do payload e orquestramos a criação das tracks.
        */
        let lectures = [];
        let tracks = []
        let track = 0
        let cronograma = {
            'data': []
        }
        let diferenca = data['data']

        /*
        Neste loop é verificado a necessidade da criação de mais de uma track, utilizando por base 
        a diferença entre o payload original informado e as palestras utilizadas na ultima track.
        */
        while (diferenca.length > 0) {
            let newData = {
                'data': []
            }
            let a = this.criarTracks(data, track += 1);
            let lec = a[1];
            lectures.push(lec)
            tracks.push(a[0])
            
            diferenca = this.diffArray(data['data'], lec);

            diferenca.forEach(diff => {
                newData['data'].push(diff);
            })
            data = newData;
            
        }
        tracks.forEach(track => {
            cronograma['data'].push(track)
        })
        return cronograma
    }
    
    setTracks(lectures, track) {
        /*
        Aqui as tracks após criadas são formatadas para serem apresentadas conforme o padrão de response do exercício.
        */

        let tracks = {
            "title": `track ${track}`,
            "data": lectures
        }
        return tracks
    }

    formatHour(hour) {
        /*
        Aqui é formatada a apresentação dos horários de cada palestra para o padrao americano.
        */

        let hr = hour.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        
        if (hour < parseISO('2019-01-01 10:00:00') || hour > parseISO('2019-01-01 12:59:59')) {
            hr = `0${hr}`;
        }
        return hr;
    }
    setTiming(data: string) {
        /*
        Aqui é criado um array contendo um dicionario com nome e timing para cada palestra.
        */

        const lista = []
        let timeLecture = 0
        
        data['data'].forEach(lecture => {

            if (lecture.match('lightning')) {
                timeLecture = 5;
                let lec = {
                    'lecture': lecture,
                    'timing': timeLecture
                }
                lista.push(lec)
            } else {
                timeLecture = lecture.replace(/[^0-9]/g,'');
                let lec = {
                    'lecture': lecture,
                    'timing': timeLecture
                }
                lista.push(lec)
            }
        }); 

        return lista
    }
    /*
    Estas três funções seguintes trabalham em conjunto para converter a hora 
    de string ou int no formato "00:00:00". 
    */
    timestrToSec(timestr) {
        /*
        Aqui convertemos o horario "string" em segundos.
        */

        let parts = timestr.split(":");
        return (parts[0] * 3600) +
               (parts[1] * 60) +
               (+parts[2]);
      }
      
    pad(num) {
        /*
        Aqui é adicionadum um "0" a frente dos numeros menores que 10.
        */
        
        if(num < 10) {
            return "0" + num;
        } else {
            return "" + num;
        }
    }
    
    formatTime(seconds) {
        /*
        Aqui é onde de fato é formatado como valores numericos o horário.
        */

        return [this.pad(Math.floor(seconds/3600)),
                this.pad(Math.floor(seconds/60)%60),
                this.pad(seconds%60),
                ].join(":");
      }
}