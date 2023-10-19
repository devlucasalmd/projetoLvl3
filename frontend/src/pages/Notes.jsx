import React, { useEffect, useState } from 'react'
import "./Notes.css"
import Modal from '../components/Modal/Modal'
import Note from '../components/Notes/Note'
import AddNewButton from '../components/UI/AddNewButton'
import axios from 'axios';

function Notes() {
  const [notes,setNotes] = useState([])
  const [showModal, SetShowModal] = useState(false)

  const pegarDadosApi = () => {
    axios.get('http://localhost:3001/notes/')
    .then(res=>{
      setNotes(res.data)
    }).catch(err=>console.log("Erro ao pegar os dados da API", err))
  }

  const createNote = (title, description) => {
    axios.post('http://localhost:3001/notes/createNote', {title,description})
    .then(res => {
      setNotes([...notes, res.data.note])

      pegarDadosApi();

    }).catch(err=>{
      console.log("Erro ao cadastrar a anotação", err)
    })

    const deleteNote = (id) => {
      axios.delete(`http://localhost:3001/notes/deleteNote/${id}`)
      .then(res => {
        setNotes(notes.filter(n=> n.id !== id))
        pegarDadosApi();
      }).catch(err => console.log("Erro ao deletar a anotação", err))
    }

    const editNode = (id,title,description) => {
      axios.put(`http://localhost:3001/notes/editNote/${id}`, {title, description})
      .then(res => {
        let newNotes = notes.map( (n) => {
          if(n.id == id){
            return res.data.note
          }
          return n;
        })
        setNotes(newNotes)
      }).catch(err=>console.log("Erro ao editar a anotação", err))
    }
    
    useEffect(() => {
      pegarDadosApi();
    }, [])
  }

  const mudarModal= ()=>{
    SetShowModal((state)=>!state)
  }
  const addMode= ()=>{

  }
  return (
    <div className='notes'>
      <AddNewButton abrirOModal={mudarModal}/>
      {
        notes.map(n=> <Note abrirOModal={mudarModal} n={n}/>)
      }

      {
        showModal ? <Modal fecharOModal={mudarModal}/> : null
      }
    </div>
  )
}

export default Notes