<script setup>
import { onMounted, ref } from "vue";
import router from "../router";
import qs from "qs";

const selectedUserID = ref("");
const selectedUserName = ref("");

const users = ref([]);
const userChats = ref([]);
const receiverID = ref(null);
const msgContent = ref(null);

const loggedInUserID = ref(null);
const loggedInUserName = ref(null);

const fetchLoggedInUser = async () => {
  const req = await fetch("http://localhost:3000/api/accounts/me", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res = await req.json();
  loggedInUserID.value = res.user.id;
  loggedInUserName.value = res.user.name;
};

const fetchUsers = async () => {
  const req = await fetch(
    `http://localhost:3000/api/accounts?where[id][not_equals]=${loggedInUserID.value}&sort=id`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const res = await req.json();
  users.value = res.docs;
};

onMounted(async () => {
  await fetchLoggedInUser();
  await fetchUsers();
});

const load = ref(false);
const fetchUserChats = async () => {
  load.value = true;
  const stringifiedQuery = await qs.stringify(
    {
      where: {
        or: [
          {
            and: [
              {
                authorID: {
                  equals: loggedInUserID.value,
                },
              },
              {
                receiverID: {
                  equals: selectedUserID.value,
                },
              },
            ],
          },
          {
            and: [
              {
                authorID: {
                  equals: selectedUserID.value,
                },
              },
              {
                receiverID: {
                  equals: loggedInUserID.value,
                },
              },
            ],
          },
        ],
      },
    },
    {
      addQueryPrefix: true,
    }
  );
  const req = await fetch(
    `http://localhost:3000/api/chats${stringifiedQuery}&sort=id`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const res = await req.json();
  userChats.value = await res.docs;
  load.value = false;
};

const sendStatus = ref(null);
const sendMessage = async (e) => {
  e.preventDefault();

  const req = await fetch("http://localhost:3000/api/chats/", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      receiverID: receiverID.value,
      content: msgContent.value,
    }),
  });
  if (req.statusCode == 200) {
    sendStatus.value = "Send message Success";
  }

  const res = await req.json();

  await fetchUserChats();
};

const logout = async () => {
  await fetch("http://localhost:3000/api/accounts/logout/", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  router.replace("/");
};

function isSelf(id) {
  if (id == loggedInUserID.value) return true;
  else return false;
}
</script>

<template>
  <main>
    <div class="header">
      <div>
        <h2 style="font-weight: bold">
          Chat <span style="color: rgb(36, 88, 207)">Page</span>
        </h2>
      </div>
      <div>
        <h3>
          Welcome, <span style="font-weight: bold">{{ loggedInUserName }}</span>
        </h3>
        <h5>id : {{ loggedInUserID }}</h5>
      </div>
    </div>

    <div class="logout-btn">
      <button class="logout" @click="logout">Log Out</button>
    </div>
    <br />


    <div>
      <h2>Chatroom Select</h2>
    </div>
    <div class="user-list">
      <div
        v-for="u in users"
        @click="
          selectedUserID = u.id;
          selectedUserName = u.name;
          fetchUserChats();
        "
      >
        <p>
          USER : <span style="color: rgb(36, 88, 207)">{{ u.name }}</span>
        </p>
      </div>
    </div>
    <br />
    <div v-if="selectedUserID">
      <br>
      Selected : {{ selectedUserName }}
      <div v-for="u in users">
        <h5 v-if="u.name == selectedUserName">id: {{ u.id }}</h5>
      </div>
    </div>
    <br v-if="load">
    <p v-if="load" style="color: yellow;">Loading...</p>
    <br v-if="load">
    <div v-if="userChats.length > 0">
      <div v-for="uc in userChats">
        <div v-if="isSelf(uc.authorID)">
          <p>FROM - Me</p>
          <p>TO - <span style="color: rgb(36, 88, 207)">{{ uc.receiverID }}</span></p>
          <h5>at {{ uc.createdAt }}</h5>
          <h4>Content : {{ uc.content }}</h4>
        </div>
        <div v-else>
          <p>FROM - {{ uc.authorID }}</p>
          <p >TO - <span style="color: rgb(36, 88, 207)">Me</span></p>
          <h5>at {{ uc.createdAt }}</h5>
          <h4>Content : {{ uc.content }}</h4>
        </div>

        <br />
      </div>
    </div>

    <div v-else>
      <br>
      <p v-if="selectedUserName && !load">No Messages from {{ selectedUserName }}</p>
    </div>

    <br /><br />

    <div class="send-form">
      <h2>Send Messages</h2>
      <form @submit="sendMessage">
        <div>
          <input type="text" placeholder="Send To" v-model="receiverID" />
        </div>
        <div>
          <input type="text" placeholder="Content" v-model="msgContent" />
        </div>

        <button class="login" type="submit">Send</button>
      </form>
      <h5 if="sendStatus">{{ sendStatus }}</h5>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
  color: white;
}

h1 {
  margin-bottom: 1rem;
}
</style>
