// @angular
import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

// @ionic
import { ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';

// Config
import {Config} from '../../config/config';


@Component({
  selector: 'bici-module',
  templateUrl: 'bici.page.html',
  styleUrls: ['bici.page.scss'],

})

export class BiciModule {

	Headers: Headers;
	ReqOptions: RequestOptions;

	// Props de la Modal.
	id = 0;
	nombre = '';
	modelo = ''
	color = ''
	rodado = ''
	precio = '';
	edit = false;
	title = '';


	name = '';
	price = '';

	models = [{ id: 1, name: 'Specialized' },
			  { id: 2, name: 'Scott' },
			  { id: 3, name: 'Giant' },
			  { id: 4, name: 'Canyon' },
			  { id: 5, name: 'Cannondale' },
			  { id: 6, name: 'Trek' }];
	colors = [{ id: 1, name: 'Blue' },
			  { id: 2, name: 'Gold' },
			  { id: 3, name: 'Silver' },
			  { id: 4, name: 'Red' },
			  { id: 5, name: 'Black' }];
	rings = [{ id: 1, name: "16" },
			 { id: 2, name: "20" },
			 { id: 3, name: "26" },
			 { id: 4, name: "30" },
			 { id: 5, name: "36" },
			 { id: 6, name: "40" }];

	selectModel: any = '';
	selectColor: any = '';
	selectRing: any = '';

	constructor(private modalCtlr: ModalController, private http: Http, public toastController: ToastController, private loadingController: LoadingController, private alertController: AlertController) {
		this.Headers = new Headers({'Content-Type': 'application/json'});
		this.ReqOptions = new RequestOptions({headers: this.Headers});

	}

	ngAfterContentInit() {
		this.name = (this.nombre != '') ? this.nombre : '';
		this.selectModel = (this.modelo != '') ? this.modelo : '';
		this.selectColor = (this.color != '') ? this.color : '';
		this.selectRing = (this.rodado != '') ? this.rodado : '';
		this.price = (this.precio != '') ? this.precio : '';

    }

	sendForm() {
		let self = this;

		if (self.name != '' && self.price != '' && self.selectModel != '' && self.selectColor != '' && self.selectRing != '')  {
			self.httpPostHandler(Config.SERVICE_URL.ADDBIKE, {
				nombre: self.name,
				modelo: self.selectModel,
				color: self.selectColor,
				rodado: self.selectRing,
				precio: self.price
			});

			self.presentLoading();
		} else {
			self.presentToast('Warning: Empty fields', 2000);
		}
	}

	httpPostHandler(service: string, body: any) : Promise<any> {
		return this.http
		.post(Config.SERVICE_BASE+service, body, this.ReqOptions)
		.toPromise()
		.then(this.solvedPostThen.bind(this))
		.catch(this.solvedPostCatch.bind(this));
	}

	solvedPostThen(response: Response) {
		let self = this;
		let toJson = response.json();

		setTimeout(() =>{
			self.loadingController.dismiss();
			self.modalCtlr.dismiss();
		}, 1500);

		setTimeout(() =>{
			self.presentToast(toJson.data, 1500);
		}, 1700);
	}

	solvedPostCatch(error: any) {
		let  self = this;
		let toJson = error.json();

		setTimeout(() =>{
			self.loadingController.dismiss();
		}, 500);

		if (toJson.code == 422) {
			if (toJson.data[0].type == 'string.regex.base') {
				setTimeout(() =>{
					self.presentToast('Only letters for name.', 1500);
				}, 800);
			} else if (toJson.data[0].type == 'number.base') {
				setTimeout(() =>{
					self.presentToast('Only numbers for price.', 1500);
				}, 800);
			}
		}
  }

  httpPutHandler(service: string, body: any) : Promise<any> {
  	return this.http
  		.put(Config.SERVICE_BASE+service, body, this.ReqOptions)
		.toPromise()
		.then(this.solvedPutThen.bind(this))
		.catch(this.solvedPutCatch.bind(this));
	}

	solvedPutThen(response: Response) {
		let self = this;
		let toJson = response.json();

		setTimeout(() =>{
			self.loadingController.dismiss();
			self.modalCtlr.dismiss();
		}, 1500);

		setTimeout(() =>{
			self.presentToast(toJson.data, 1500);
		}, 1700);
	}

	solvedPutCatch(error: any) {
		let  self = this;
		let toJson = error.json();

		setTimeout(() =>{
			self.loadingController.dismiss();
		}, 500);

		if (toJson.code == 422) {
			if (toJson.data[0].type == 'string.regex.base') {
				setTimeout(() =>{
					self.presentToast('Only letters for name.', 1500);
				}, 800);
			} else if (toJson.data[0].type == 'number.base') {
				setTimeout(() =>{
					self.presentToast('Only numbers for price.', 1500);
				}, 800);
			}
		}
  }

  async presentToast(message: string, duration: number) {
  	const toast = await this.toastController.create({
  		message: message,
  		duration: duration
  	});
  	toast.present();
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

  closeModal() {
  	let self = this;

  	this.modalCtlr.dismiss();

  }

  sendFormEdit(id: number) {
  	let self = this;

		if (self.name != '' && self.price != '' && self.selectModel != '' && self.selectColor != '' && self.selectRing != '')  {
			self.httpPutHandler(Config.SERVICE_URL.UPDATEBIKE + '/' + id, {
				nombre: self.name,
				modelo: self.selectModel,
				color: self.selectColor,
				rodado: self.selectRing,
				precio: self.price
			});

			self.presentLoading();
		} else {
			self.presentToast('Warning: Empty fields', 2000);
		}
  }

   async presentAlertConfirm() {
      let self = this;
      const alert = await this.alertController.create({
          header: 'Confirm!',
          message: 'Are you sure to update this <b>bike<b> ?',
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
              	self.sendFormEdit(self.id);
              }
          }]
      });

      await alert.present();
  }

	onSelectChangeModel(selectedValue: any) {
		this.selectModel = (selectedValue.detail.value != undefined) ? selectedValue.detail.value : '';
	}

	onSelectChangeColor(selectedValue: any) {
		this.selectColor = (selectedValue.detail.value != undefined) ? selectedValue.detail.value : '';
	}

	onSelectChangeRing(selectedValue: any) {
		this.selectRing = (selectedValue.detail.value != undefined) ? selectedValue.detail.value : '';
	}
}

