import { Controller, Get, Post, Query, Body} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MetaService } from "./meta.service";

@Controller('meta/webhook')
export class MetaController {
    constructor(
        private configService: ConfigService,
        private metaService: MetaService,
    ) {}

    @Get()
    verifyWebhook(@Query() query) {
        const verifyToken = this.configService.get<string>('META_VERIFY_TOKEN');
        
        if (
            query['hub.mode'] === 'subscribe' &&
            query['hub.verify_token'] === verifyToken
        ) {
            return query['hub.challenge'];
        }
        
        return 'Verification failed';
    }

    @Post()
    async receiveLead(@Body() body) {
        console.log('Webhook payload:', JSON.stringify(body, null, 2));

        const leadId = body.entry?.[0]?.changes?.[0]?.value?.leadgen_id;

        if (!leadId) {
            return { status: 'No lead id found' };
        }

        const lead = await this.metaService.getLeadDetails(leadId);

        console.log('Lead Data:', lead);

        return { status: 'Lead processed' };
    }
}
