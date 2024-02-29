interface User {
    firstname: string,
    lastname: string,
    username: string,
    password: string,
    mail: string,
    role: string,
    services: [

    ],
    workSchedule: [
        {
            day: number, // 0 to 6
            schedule: [
                {
                    start: Date,
                    end: Date
                }
            ]
        }
    ]
    preferences: [
        {
            service: Service,
            favoriteEmployees: []
        }
    ]
}

interface Appointment {
    appointmentDate: Date,
    client: User,
    employee: User,
    subService: Service,
    price: number,
    reminders: [], // LOW
    payment: {
        paymentDate: Date,
        amount: number
    },
    status: number, // 0:
    commision: number, 
    statusHistory: [{
        status: number,
        statusDate: Date
    }]
}

interface Service {
    name: string,
    description: string,
    imgPath: string,
    subServices: [
        {
            name: string,
            description: string,
            duration: number,
            price: number,
            ptgCommision: number,
            promotions: [
                {

                }
            ],
            history: [

            ]
        }
    ]
}

interface holiday {
    designation: string,
    holidayDate: Date
}

interface ebit {
    ebitDate: Date,
    expenses: [{
        designation: string,
        amount: number
    }],
    totalProfit: number
}