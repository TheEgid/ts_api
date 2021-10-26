import {
  // Action,
  JsonController,
  Get,
  // UseInterceptor
} from 'routing-controllers';
import 'reflect-metadata';

@JsonController()
export default class SimpleController {
  @Get('/')
  get() {
    return { message: 'Ok' };
  }
}
