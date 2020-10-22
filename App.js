
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import colors from "./Colors"
import {AntDesign} from "@expo/vector-icons"
//import tempData from "./tempData"
import TodoList from "./components/TodoList"
import AddListModal from "./components/AddListModal"
import Fire from "./Fire"
import _ from 'lodash';
import { Colors } from 'react-native/Libraries/NewAppScreen'


export default class App extends React.Component {

  
  state = {
    addTodoVisible: false,
    lists : [],
    user:{},
    loading : true
  }

  componentDidMount(){
    firebase = new Fire((error, user) => {
      if (error){
        return alert("ERORR BROWWWW!!!!")
      }

      firebase.getLists(lists => {
        this.setState ({lists, user}, () => {
          this.setState ({ loading: false})
        })
      })

      this.setState({ user })
    })
  }

  componentWillUnmount(){
    firebase.detach()
  }

  toggleAddTodoModal(){
    this.setState ({ addTodoVisible: !this.state.addTodoVisible})
  }

  renderList = list => {
    return <TodoList list={list} updateList= {this.updateList}/>
  }

  addList = list => {
    firebase.addList({
      name : list.name,
      color: list.color,
      todo: []
    })
  }

  updateList = list => {
    firebase.updateList(list)
  }

  render(){
    if (this.state.loading){
      return (
        <View style={styles.containers}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      )
    }


    return (
      <View style= {styles.containers}>
        <Modal 
          animationType="slide" 
          visible={this.state.addTodoVisible}
          onRequestClose={() => this.toggleAddTodoModal()}
        >
          <AddListModal closeModal={() => this.toggleAddTodoModal()} addList={this.addList}/>
        </Modal>

        <View style= {{flexDirection: "row"}}>
            <View style= {styles.divider} />
            <Text style= {styles.title}>
              Alvin's <Text style={{fontWeight:"100", color: colors.blue}}>Todo</Text>
            </Text>
            <View style= {styles.divider} />
          </View>

          <View style={{marginVertical:26}}>
            <TouchableOpacity style={styles.addList} onPress= {()=> this.toggleAddTodoModal()}>
              <AntDesign name="plus" size={16} color={colors.blue} />
            </TouchableOpacity>

            <Text style={styles.add}>Tambah</Text>
          </View>
          
          <View style={{height: 350, padding: 30}}>
            <FlatList 
              data={this.state.lists} 
              keyExtractor={item => item.id.toString()} 
              horizontal={true} 
              showsHorizontalScrollIndicator={false} 
              renderItem={({ item })=> this.renderList(item)}
              keyboardShouldPersistTaps="always"                 
            />
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containers:{
    flex: 1,
    backgroundColor: "#fff",
    alignItems:"center",
    justifyContent:"center"
  },
  divider: {
    backgroundColor: colors.lighBlue,
    height: 1,
    flex: 1,
    alignSelf: "center"
  },
  title: {
    fontSize: 38,
    fontWeight:"bold",
    color: colors.black,
    paddingHorizontal: 64
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.lighBlue,
    borderRadius: 4,
    padding : 16,
    alignContent: "center",
    justifyContent: "center"
  },
  add: {
    color: colors.blue, 
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8
  }
});
