import { Public } from '@/middlewares/public.decorator';
import { Controller, Get } from 'routing-controllers';

@Controller()
export class IndexController {
  @Get('/')
  @Public('Service root - returns a constant, no user context')
  index() {
    return 'OK';
  }
}
