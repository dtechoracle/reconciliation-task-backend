import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReconcileModule } from './reconcile/reconcile.module';

@Module({
  imports: [ReconcileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
