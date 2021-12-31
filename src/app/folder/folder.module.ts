import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import {SplitterModule} from 'primeng/splitter';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    DragulaModule.forRoot(),
    SplitterModule
  ],
  declarations: [FolderPage],
  providers: [
    DragulaService
  ]
})
export class FolderPageModule {}
