import firebase from 'firebase'
import '@firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyA9rNxSGAomIpVcUh38LfcTgEWy9jP4gTY",
    authDomain: "todoapp-a2cb6.firebaseapp.com",
    databaseURL: "https://todoapp-a2cb6.firebaseio.com",
    projectId: "todoapp-a2cb6",
    storageBucket: "todoapp-a2cb6.appspot.com",
    messagingSenderId: "285712510193",
    appId: "1:285712510193:web:b003b1803dc67ca1b78d50"
}

class Fire{
    constructor (callback){
        this.init(callback)
    }

    init(callback){
        if (!firebase.apps.length){
            firebase.initializeApp(firebaseConfig)
        }
        firebase.auth().onAuthStateChanged(user =>{
            if (user){
                callback(null,user)
            }
            else{
                firebase.auth().signInAnonymously().catch(error => { callback(error)})
            }
        })
    }

    getLists (calllback){
        let ref = this.ref.orderBy("name")

        this.unsubscribe = ref.onSnapshot (snapshot =>{
            lists = []

            snapshot.forEach (doc =>{
                lists.push ({id: doc.id, ...doc.data()})
            })

            calllback(lists)
        })
    }

    addList(list){
        let ref = this.ref

        ref.add(list)
    }

    updateList(list){
        let ref = this.ref
        
        ref.doc(list.id).update(list)
    }

    get userId(){
        return firebase.auth().currentUser.uid
    }

    get ref(){
        return firebase.firestore().collection("users").doc(this.userId).collection("lists")
    }


    detach(){
        this.unsubscribe()
    }
}

export default Fire