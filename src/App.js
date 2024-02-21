import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConnection";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import "./app.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [user, setUser] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(listaPost);
      });
    }

    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          // se tem usuario logado ele entra aqui...
          console.log(user)
          setUser(true)
          setUserDetails({
            uid: user.uid,
            email: user.email
          })
        }else{
          //  nao possui nenhum user logado
          setUser(false)
          setUserDetails({})
        }
      })
    }
    checkLogin();
  }, [])
  async function handleAdd() {
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor
    // })
    // .then(() => {
    //   console.log("DADOS REGISTRADO NO BANCO!")
    // })
    // .catch((error) => {
    //   console.log("Gerou Erro" + error)
    // })

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("DADOS REGISTRADO NO BANCO!");
        setTitulo("");
        setAutor("");
      })
      .catch((error) => {
        console.log("Gerou Erro" + error);
      });
  }

  async function buscarPost() {
    // const postRef = doc(db, "posts", "123")
    // await getDoc(postRef)
    // .then((snapshot) => {
    //   setTitulo(snapshot.data().titulo)
    //   setAutor(snapshot.data().autor)
    // })
    // .catch((error) => {
    //   console.log("Gerou Erro" + error)
    // })

    const postsRef = collection(db, "posts");

    await getDocs(postsRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(lista);
      })
      .catch((error) => {
        console.log("DEU ALGUM ERRO AO BUSCAR" + error);
      });
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Post atualizado com sucesso!");
        setIdPost("");
        setTitulo("");
        setAutor("");
      })
      .catch((error) => {
        console.log("ERRO AO ATUALIZAR O POST", error);
      });
  }

  async function excluirPost(id) {
    const excluirRef = doc(db, "posts", id);
    await deleteDoc(excluirRef)
      .then(() => {
        alert("Post deletado com sucesso!");
      })
      .catch((error) => {
        console.log("ERRO AO ATUALIZAR O POST", error);
        if (error.code === "auth/weak-password") {
          alert("Senha muito fraca.");
        } else if (error.code === "auth/email-already-in-use") {
          alert("Email já existe!");
        }
      });
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("CADASTRADO COM SUCESSO!");
        console.log(value);
        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        console.log("ERROR AO CADASTRAR", error);
      });
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        setUserDetails({
          uid: value.user.uid,
          email: value.user.email,
        });
        setUser(true);

        setEmail("");
        setSenha("");
      })
      .catch((error) => {});
  }

  async function fazerLogout() {
    await signOut(auth)
    setUser(false)
    setUserDetails({})
  }

  return (
    <div className="App">
      <h1>ReactJS + Firebase :)</h1>

      {user && (
        <div>
          <strong>Seja Bem-Vindo(a) (Você está logado!)</strong>
          <br />
          <span>
            ID: {userDetails.uid} - Email: {userDetails.email}
          </span>
          <br />
          <button onClick={fazerLogout}>Sair da conta</button>
          <br />
          <br />
        </div>
      )}

      <h2>Usuarios</h2>
      <div className="container">
        <label>Email: </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite um email valido"
        />

        <label>Senha: </label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Informe sua senha ****"
        />

        <button onClick={novoUsuario}>Cadastrar Usuario</button>
        <button onClick={logarUsuario}>Fazer Login</button>
      </div>
      <br />

      <hr />
      <div className="container">
        <h2>Posts</h2>
        <label>ID do Post:</label>
        <input
          placeholder="Digite o ID do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />

        <label>Titulo: </label>
        <textarea
          type="text"
          placeholder="Digite o titulo"
          value={titulo}
          onChange={(e) => {
            setTitulo(e.target.value);
          }}
        />

        <label>Autor:</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button className="btn" onClick={handleAdd}>
          Cadastrar
        </button>
        <button onClick={buscarPost}>Buscar</button>
        <br />
        <button onClick={editarPost}>Atualizar Post</button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>ID: {post.id}</strong>
                <br />
                <span>Titulo: {post.titulo}</span>
                <br />
                <span>Autor: {post.autor} </span>
                <br />
                <button onClick={() => excluirPost(post.id)}>Excluir</button>
                <br /> <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
