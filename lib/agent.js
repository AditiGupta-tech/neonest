import { GoogleGenerativeAI } from "@google/generative-ai";
class Agent{
    constructor({
        prompt="You are a generative model",
        model=new GoogleGenerativeAI(process.env.GEMINI_API),
        example_response=[
            {
                role: "user",
                parts: [{text: `How are you.`,},],
            },
            {
                role: "model",
                parts: [{text: `How are you? How is your baby?`,},]
            }
        ]}
    ){
        this.prompt = prompt
        this.model = model.getGenerativeModel({model:"gemini-2.0-flash"})
        this.example_response = example_response
    }
    
    async getResponse(text){
        const result = await this.model.generateContent({
            contents:[
                ...this.example_response,
                {
                    role:"user",
                    parts:[
                        {
                            text,
                        }
                    ]
                }],
            systemInstruction:
                {parts:{
                    text:this.prompt
                }}
        })
        const response = await result.response.text()
        return response
    }
}

class JSONAgent extends Agent{
    constructor(
        {prompt=`You are an agent who generates JSON responses.
        general rules
         - always add actionName, request, notes and description
         - always add notification after each.
         - If media is nothing do not include memory and notification

        You respond in following format:

        \`\`\`JSON
        {
            "isAction":true/false,
            "isDone": if already done true else false
            "actionName": //any value from below otherwise "no action",
            "values":{key-pair according to the description below} do not include if isAction is false,
            "description"://success message or the reason why isAction is false,
            "request":"insert","update","delete","other"
        }  
        \`\`\`

        
        The actionName will be decided among
        [growth,feeding,sleep,vaccination,doctor_contact,essentials,memory,notification]
        
        memory will not be included if media is "nothing".

        for growth the values will be:
        {"date":today's date format is YYYY-MM-DD,
        "height":float height in cm,
        "weight":float weight in kg,
        "head": float in cm}
        
        for feeding the values will be:
        {
        "time"://current time like '08:31 PM'
        "type": //'Breastfeeding' , 'Bottle' , 'Solid Food' (not other than this),
        "amount"://amount according to type,
        "notes"://the note according to the reply
        }

        for sleep the values will be:
        {
        "time"://the respective time, html input type date compatible,
        "type": // "nap", "night" (not other than this),
        "duration"://(string) a time amount according to type, default is 8hrs,
        "mood"://"happy","cranky","sleepy","playful" else string containing emoji and type,
        "notes"://the note according to the reply,
        "date"://the date when baby slept use relatively with todays date,
        "babyName"://If given else "Your baby"
        }

        for vaccination the values will be
        {
        "name"://name of vaccin if given else unkown,
        "scheduledDate": //Date of Vaccination,
        "date"://html date input compatible,
        "completeDate"://html date input compatible,
        "notes"://the note according to the,
        "status":"scheduled",'completed', 'overdue'(nothing other than this),
        "description"://more detailed description,
        }

        for doctor_contact the values will be
        {
        "name"://name of doctor if given else unkown,
        "category": //"scheduled", "completed" can not be null, default is scheduled,
        "type"://"phone" , "website",
        "value"://a valid phone number or weblink,
        "description"://the note according to the reply,
        }

        for essentials the values will be
        {
        "name"://name of item if given else unkown,
        "category": //"diapering","feeding","clothing","health","playtime","bathing","sleeping","travel","traditional","cleaning","others", (not other than this),
        "currentStock"://a number from message, cannot be null default is 5,
        "minThreshold"://number to set alert for demand, cannot be null default is 2,
        "unit" : // "pieces", "bottles", "packs", "boxes", "oz", "lbs",
        "notes"://the note according to the reply
        }

        for memories the values will be : 
        {
        "title"://title of memory if given else a sentence including date and the memory ,
        "type": //image, video (not other than this),
        "description"://the description of memory as first person,
        "tags"://generate tags from memory,
        "isPublic"://true or false according to reply
        }
        
        if the media is nothing for memory:
        {
        "isAction":false,
        "actionName":"no action",
        "status":"other",
        "description":"failed"
        //do not add notification for this!
        }


        for notification the values will be
        {
        "type"://"feeding_reminder","sleep_reminder", "vaccine_reminder","appointment_reminder","milestone_celebration","weather_alert","essentials_alert","general",
        "title": //according to reply
        "message"://the description message,
        "priority"://"low", "medium", "high", "urgent" (not other than this),
        "scheduledFor"://MongoDB compatible stringified Date object,
        "isRead"://false always,
        "isSent"://false always,
        "actionUrl":"Essentials","Feeding","Growth","Medical","Memories","Sleep" (nothing other than this),
        "category"://"reminder", "alert", "celebration", "info" (nothing other than this)
        }
        You can return multiple events like (memory and food) using json array that following the format given here.
        `,
        model=new GoogleGenerativeAI(process.env.GEMINI_API),
        example_response=[
            {
                role: "user",
                parts: [{text: `baby's height grew with 15.74 inches also add to memory`,},],
            },
            {
                role: "model",
                parts: [{text: `
                    [{
                    "isAction":true,
                    "actionName":"growth",
                    "values":{
                        "date":"2025-08-03",
                        "height":40,
                        "weight":null,
                        "head":null,
                        },
                    "isAction":true,
                    "actionName":"notification",
                    "values":{
                        "type":"general",
                        "title": "The growth updated",
                        "message":"The baby's height increased by 40 cm",
                        "priority":"low",
                        "scheduledFor":"2025-08-03T17:55:00.885+00:00",
                        "isRead":false,
                        "isSent":false,
                        "actionUrl":"Growth",
                        "category":"info"
                    }
                    {
                    "isAction":true,
                    "actionName":"memory",
                    "values":{
                        "title":"baby height growth on 03-08-2025",
                        "type": video,
                        "description":"The baby's height increased by 40 cm",
                        "tags":"#baby #height #happy",
                        "isPublic":false,
                        }
                    },
                    "isAction":true,
                    "actionName":"notification",
                    "values":{
                        "type":"general",
                        "title": "New memory added for baby's growth",
                        "message":"The baby's height increased by 40 cm",
                        "priority":"low",
                        "scheduledFor":"2025-08-03T17:55:00.885+00:00",
                        "isRead":false,
                        "isSent":false,
                        "actionUrl":"Memories",
                        "category":"celebration"
                    }
                ]
                   `,},]
            },
            {
                role: "user",
                parts: [{text: `Now forget the previous data`,},],
            },
            {
                role: "model",
                parts: [{text: `
                    [{
                    "isAction":false,
                    "description:"Ok, I will not remember the previous entries."
                        },]
                   `,},]
            }
        ]}){
            super({prompt,model,example_response});
        }

        async getResponse(text){
            const response = await super.getResponse(text)
            const json_response = JSON.parse(response.replaceAll("```","").replace("json",""))
            return json_response
        }
}

export default JSONAgent
