# Meta Lead Capture PoC (Proof of Concept)

## Objective

Demonstrate that our system can capture marketing leads **directly from
Meta (Facebook / Instagram / Messenger)** using the **Marketing API and
Webhooks**, without relying on intermediaries like Google Sheets.

The PoC proves: 1. Meta can send lead events to our backend. 2. Our
backend can fetch complete lead data via the Graph / Marketing API. 3.
Leads can be stored or processed directly in our system.

------------------------------------------------------------------------

# High Level Flow

Meta Lead Form\
↓\
Meta Webhook Event (leadgen)\
↓\
Nest.js Webhook Endpoint\
↓\
Fetch Lead via Marketing API\
↓\
Log / Store Lead in Database

------------------------------------------------------------------------

# Prerequisites

Before starting ensure:

-   Meta Developer Account
-   Facebook Page
-   Meta Business Manager
-   Nest.js backend running
-   Public URL for webhook (ngrok recommended)

------------------------------------------------------------------------

# Step 1 --- Create a Meta App

1.  Go to https://developers.facebook.com
2.  Create a new **Business App**
3.  Add products:
    -   Webhooks
    -   Marketing API

------------------------------------------------------------------------

# Step 2 --- Generate Access Token

Use **Graph API Explorer**.

Required permissions:

-   leads_retrieval
-   pages_read_engagement
-   ads_read

This token will be used to fetch lead details.

------------------------------------------------------------------------

# Step 3 --- Create a Test Lead Form

In **Meta Ads Manager**:

Ads Manager → Instant Forms → Create Form

Example fields:

-   Name
-   Email
-   Phone
-   City

Save the form and note the **form_id**.

------------------------------------------------------------------------

# Step 4 --- Create Webhook Endpoint (Nest.js)

Endpoint:

GET /meta/webhook\
POST /meta/webhook

Example controller:

``` ts
@Controller('meta/webhook')
export class MetaWebhookController {

  @Get()
  verify(@Query() query) {
    const VERIFY_TOKEN = "test_token";

    if (
      query['hub.mode'] === 'subscribe' &&
      query['hub.verify_token'] === VERIFY_TOKEN
    ) {
      return query['hub.challenge'];
    }

    return "Verification failed";
  }

  @Post()
  receive(@Body() body) {
    console.log("Webhook event:", body);
    return { status: "received" };
  }
}
```

------------------------------------------------------------------------

# Step 5 --- Expose Backend Publicly

Meta must reach your server.

Use **ngrok**.

``` bash
ngrok http 3000
```

Example URL:

    https://abc123.ngrok.io/meta/webhook

------------------------------------------------------------------------

# Step 6 --- Configure Webhook in Meta

Meta Developers → Webhooks

Object:

Page

Callback URL:

    https://abc123.ngrok.io/meta/webhook

Verify token:

    test_token

------------------------------------------------------------------------

# Step 7 --- Subscribe to Lead Events

Subscribe to field:

    leadgen

This event fires whenever a new lead is created.

------------------------------------------------------------------------

# Step 8 --- Generate Test Leads

Use Meta Lead Ads Testing Tool:

https://developers.facebook.com/tools/lead-ads-testing

Select:

-   Page
-   Lead Form

Click **Create Lead**.

------------------------------------------------------------------------

# Step 9 --- Receive Webhook Event

Your backend should receive:

POST /meta/webhook

Example payload:

``` json
{
 "entry": [
  {
   "changes": [
    {
     "field": "leadgen",
     "value": {
       "leadgen_id": "123456789",
       "form_id": "987654321",
       "created_time": 1712345678
     }
    }
   ]
  }
 ]
}
```

------------------------------------------------------------------------

# Step 10 --- Fetch Lead Details

Call Graph API:

    GET https://graph.facebook.com/v19.0/{leadgen_id}

Example service:

``` ts
async fetchLead(leadId: string) {

 const response = await axios.get(
   `https://graph.facebook.com/v19.0/${leadId}`,
   {
     params: {
       access_token: process.env.META_ACCESS_TOKEN
     }
   }
 );

 return response.data;
}
```

------------------------------------------------------------------------

# Step 11 --- Process Lead

After receiving webhook:

1.  Extract leadgen_id
2.  Fetch lead data
3.  Log or store the lead

Example:

``` ts
@Post()
async receive(@Body() body) {

 const leadId =
 body.entry[0].changes[0].value.leadgen_id;

 const lead = await this.metaService.fetchLead(leadId);

 console.log("Lead data:", lead);

}
```

------------------------------------------------------------------------

# Expected Output

Console should display:

    Webhook received
    Lead ID: 123456
    Name: John Doe
    Phone: +91XXXX
    Email: john@email.com

------------------------------------------------------------------------

# PoC Success Criteria

The PoC is successful if:

-   Webhook verification works
-   Test lead triggers webhook
-   Backend fetches lead details
-   Lead data is visible in logs or database

------------------------------------------------------------------------

# Benefits Demonstrated

This PoC shows:

-   Real-time lead capture
-   No dependency on Google Sheets
-   Direct Meta integration
-   Scalable architecture for CRM / sales pipelines

------------------------------------------------------------------------

# Next Steps After PoC

1.  Create proper **Lead database schema**
2.  Add **campaign attribution**
3.  Implement **sales assignment**
4.  Build **lead dashboard**
5.  Integrate with webinar and assessment modules

------------------------------------------------------------------------

End of Document
