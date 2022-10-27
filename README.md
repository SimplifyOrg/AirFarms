# Air Farms
### Setup backend:
Install dependencies to run backend:  
>```pip install -r requirements.txt``` extensive requirements.txt can be had from [here](https://github.com/SimplifyOrg/AirFarms/blob/fishery/Backend/requirements.txt)  

Install latest version of postgres SQl.  
Create empty DB in postgres sql using following credentials:
```
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': <db name>,
        'USER': <set user id>,
        'PASSWORD': <set password>,
        'HOST': '',
        'PORT': '5432',
    }
}
```
Add above JSON after filling up relevant details, in [machhli>settings.py](https://github.com/SimplifyOrg/AirFarms/blob/fishery/Backend/machhli/settings.py) file.  
Once installed run following commands to run Django backend server:  
>```python manage.py makemigrations```  
>```python manage.py migrate```  
>```python manage.py runserver```  

This should get you backend server running at http://127.0.0.1:8000/  

### Setup UI  
To run any React application, we must have NodeJS installed on our PC. So, the very first step will be to install NodeJS.  

Step 1: Install NodeJS. You may visit the [official download link](https://nodejs.org/en/download/current/) of NodeJS to download and install the latest version of NodeJS. Once we have set up NodeJS on our PC, the next thing we need to do is set up React Boilerplate.  
>```npm install -g create-react-app``` 

Step 2: Run the below command to create a new project  
>```npx create-react-app my-app```  

Step 3: Copy all the content of [UI directory](https://github.com/SimplifyOrg/AirFarms/tree/fishery/UI) in newly created my-app directory.  

Step 4: You can run the project by typing the commands:  
>```cd my-app```  
>```npm install```  
>```npm start```  

This should run the react UI at http://127.0.0.1:3000/  

