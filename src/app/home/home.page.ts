// @angular
import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

// @ionic
import { ModalController, LoadingController, ToastController, AlertController} from '@ionic/angular';

// Config
import {Config} from '../../config/config';

// Custom
import { BiciModule } from '../bici/bici.module';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})


export class HomePage {

    Headers: Headers;
    ReqOptions: RequestOptions;

    arrBikes = [];

    constructor(private modalCtlr: ModalController, private http: Http, private toastController: ToastController, private loadingController: LoadingController, private alertController: AlertController) {}

    ngAfterContentInit() {
        this.httpGetHandler(Config.SERVICE_URL.FINDALLBIKES);

    }

    async presentModal(bike: any) {
      let gridParams = (bike != '') ? bike : {};
      let countParams = Object.keys(gridParams).length;

      if (countParams != 0) {
        gridParams.edit = true;
        gridParams.title = "EDIT BIKE";
      } else {
        gridParams.title = "NEW BIKE";
      }

        const modal = await this.modalCtlr.create({ component: BiciModule, componentProps: gridParams});
        return await modal.present();
    }

    httpGetHandler(service: string) : Promise<any> {
        return this.http
            .get(Config.SERVICE_BASE+service)
            .toPromise()
            .then(this.solvedGetThen.bind(this))
            .catch(this.solvedGetCatch.bind(this));
    }

    solvedGetThen(response: Response) {
        let self = this;
        let toJson = response.json();
        let rows = toJson.data;

        for (let i = 0; i < rows.length; i++) {
            self.arrBikes.push(rows[i]);
        }
    }

    solvedGetCatch(error: any) {
        let  self = this;
        let toJson = error.json();

        console.log(toJson);
    }

    httpDeleteHandler(service: string) : Promise<any> {
        return this.http
            .delete(Config.SERVICE_BASE+service)
            .toPromise()
            .then(this.solvedDeleteThen.bind(this))
            .catch(this.solvedDeleteCatch.bind(this));
    }

    solvedDeleteThen(response: Response) {
        let self = this;
        let toJson = response.json();

        self.arrBikes = [];

        setTimeout(() =>{
            self.loadingController.dismiss();
        }, 1500);

        setTimeout(() =>{
            self.presentToast(toJson.data, 1500);
        }, 1700);

        self.httpGetHandler(Config.SERVICE_URL.FINDALLBIKES);
        
    }

    async presentToast(message: string, duration: number) {
      const toast = await this.toastController.create({
          message: message,
          duration: duration
      });
      toast.present();
  }

    solvedDeleteCatch(error: any) {
        let  self = this;
        let toJson = error.json();

        console.log(toJson);
    }

  doRefresh(event) {
      let self = this;

      setTimeout(() => {
          self.arrBikes = [];          
      }, 1900);

      setTimeout(() => {
          
              self.httpGetHandler(Config.SERVICE_URL.FINDALLBIKES);
              event.target.complete();
          
      }, 2000);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      keyboardClose: true,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  async presentAlertConfirm(bike: any) {
      let self = this;
      const alert = await this.alertController.create({
          header: 'Confirm!',
          message: 'Are you sure to eliminate this <b>bike<b> ?',
          buttons: [
          {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                  return false;
              }
          }, {
              text: 'Okay',
              handler: () => {
                  self.httpDeleteHandler(Config.SERVICE_URL.DELETEBIKES+'/'+bike.id);

                  self.presentLoading();
              }
          }]
      });

      await alert.present();
  }

}
