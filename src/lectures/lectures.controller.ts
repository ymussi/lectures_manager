import { Controller, Post, Body } from '@nestjs/common';
import { LecturesService } from './lectures.service';

@Controller('lectures')
export class LecturesController {
    constructor(private lectureService: LecturesService) {}

    @Post()
    createCronogram(@Body() body) {
        return this.lectureService.createCronogram(body);
    }
}