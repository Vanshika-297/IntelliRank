import { rankTracker } from './rankTrackerService.js';
export async function keywordTracking(tracking){
        // console.log("keywordTracking started");
    try {
        let result;

        //Try upto 2 times for reliability
        for (let attempt = 0; attempt < 2; attempt++) {
                    // console.log("Attempt:", attempt + 1);

            result = await rankTracker(tracking.keyword, tracking.domain);

            // console.log("RankTracker Result:", result);

            if (result.success && result.data.totalResultsScanned>0) {
                break;
            }
            if(attempt<2) await new Promise((r) => setTimeout(r, result.success?3000:5000)); // Wait before retrying
        }
        if(result.success){
            const prev=tracking.currentPosition;
            const today=new Date();
            today.setHours(0,0,0,0);

            tracking.currentPosition=result.data.position;
            tracking.currentPage=result.data.page;
            tracking.competitors=result.data.competitors;
            tracking.lastChecked=new Date();
            tracking.status='completed';

            //Update stats
            tracking.positionChange=prev && result.data.position ? prev-result.data.position : 0;
            if(result.data.position && (!tracking.bestPosition || result.data.position<tracking.bestPosition)){
                tracking.bestPosition=result.data.position;
            }
            //Update rank history
            const historyEntry={
                date: today,
                position: result.data.position,
                page: result.data.page,  
                title: result.data.title,
                snippet: result.data.snippet
            }
            const idx=tracking.rankHistory.findIndex((h)=>h.date.toDateString()===today.toDateString());
            if(idx>=0) tracking.rankHistory[idx]=historyEntry;
            else tracking.rankHistory.push(historyEntry);
        }else{
                tracking.status='failed';
            }

            // console.log("Before save");

            await tracking.save()

                //  console.log("After save");

            return result;

} catch (error) {
    console.error("Rank update error:",error.message);
    tracking.status="failed";
    await tracking .save().catch(()=>{})
    return{success:false,error:error.message}
}
}