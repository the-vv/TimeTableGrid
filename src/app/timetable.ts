export interface Timetable {
    classId?: string;
    className?: string;
    hoursCount?: number;
    date?: Date;
    allocation?: {
        [key: number]: string;
    };
}
