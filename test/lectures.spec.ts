import { Test } from '@nestjs/testing';
import { LecturesService } from "../src/lectures/lectures.service";
import { async } from 'rxjs/internal/scheduler/async';



const mochTrack = {
        "data": [
            {
                "title": "track 1",
                "data": [
                    "09:00 AM Writing Fast Tests Against Enterprise Rails 60min",
                    "10:00 AM Overdoing it in Python 45min",
                    "10:45 AM Lua for the Masses 30min",
                    "11:15 AM Ruby Errors from Mismatched Gem Versions 45min",
                    "12:00 PM Lunch",
                    "01:00 PM Common Ruby Errors 45min",
                    "01:45 PM Rails for Python Developers lightning",
                    "01:50 PM Communicating Over Distance 60min",
                    "02:50 PM Accounting-Driven Development 45min",
                    "03:35 PM Woah 30min",
                    "04:05 PM Sit Down and Write 30min",
                    "05:00 PM Network Event"
                ]
            }
        ]
    };


describe('Lectures teste', () => {
    let lecturesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                LecturesService,
            ],
        }).compile();

        lecturesService = await module.get<LecturesService>(LecturesService);
    });

    describe('createCronogram', () => {
        it('createCronogram', () => {
            const data = lecturesService.createCronogram(
                `{"data":[
                    "Writing Fast Tests Against Enterprise Rails 60min",
                    "Overdoing it in Python 45min",
                    "Lua for the Masses 30min",
                    "Ruby Errors from Mismatched Gem Versions 45min",
                    "Common Ruby Errors 45min",
                    "Rails for Python Developers lightning",
                    "Communicating Over Distance 60min",
                    "Accounting-Driven Development 45min",
                    "Woah 30min",
                    "Sit Down and Write 30min"
                    ]}`
            )
           expect(data).toBe(mochTrack);

    })
    });
});


