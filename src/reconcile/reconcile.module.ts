import { Module } from '@nestjs/common';
import { ReconcileController } from './reconcile.controller';
import { ReconcileService } from './reconcile.service';

@Module({
  controllers: [ReconcileController],
  providers: [ReconcileService]
})
export class ReconcileModule {}
