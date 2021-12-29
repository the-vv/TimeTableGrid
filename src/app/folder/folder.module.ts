import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { DragulaModule, DragulaService } from 'ng2-dragula';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    DragulaModule.forRoot()
  ],
  declarations: [FolderPage],
  providers: [
    DragulaService
  ]
})
export class FolderPageModule {}
