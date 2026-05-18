import { Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { DelegateModule } from './delegate/delegate.module';
import { InscriptionsModule } from './inscriptions/inscriptions.module';
import { MatchesModule } from './matches/matches.module';
import { PlayersModule } from './players/players.module';
import { ProfessionalCollegesModule } from './professional-colleges/professional-colleges.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AdminsModule,
    AuthModule,
    CategoriesModule,
    DelegateModule,
    InscriptionsModule,
    MatchesModule,
    UsersModule,
    TeamsModule,
    PlayersModule,
    ProfessionalCollegesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
