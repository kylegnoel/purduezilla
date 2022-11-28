import Dashboard from "./Dashboard";
import { TourProvider, useTour } from "@reactour/tour";
import { useEffect } from "react";


export default function DashboardTour() {
    useEffect(() => {
        console.log("starting tour in 2 second")
        setTimeout(() => {
            console.log("starting tour now")
            document.getElementById('start-tour').click();
        }, 2000);
    }, []);

    return (
        <TourProvider steps={steps}>
            <Dashboard></Dashboard>
        </TourProvider>
    );
}

const steps = [
    {
        selector: '.first-step',
        content: 'You can return back home here'
    },
    {
        selector: '.second-step',
        content: "Navigate around here"
    },
    {
        selector: '.third-step',
        content: 'View profile here'
    }
]
    
