<template>
  <div style="padding: 1rem;">
    <h1>Gestion de stocks - Clients</h1>

    <form @submit.prevent="onAdd" style="margin-bottom: 1rem;">
      <input v-model="nom" placeholder="Nom du client" />
      <input v-model="prenom" placeholder="prenom du client" />
      <input v-model="email" placeholder="Email" />
      <input v-model="telephone" placeholder="Téléphone" />
      <button type="submit">Ajouter</button>
    </form>

    <button @click="load">Recharger</button>

    <table border="1" cellpadding="5" cellspacing="0" style="margin-top: 1rem;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Prenom</th>
          <th>Email</th>
          <th>Téléphone</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in clients" :key="c.id">
          <td>{{ c.id }}</td>
          <td>{{ c.nom }}</td>
          <td>{{ c.prenom }}</td>
          <td>{{ c.email }}</td>
          <td>{{ c.telephone }}</td>
          <td>
            <button @click="onEdit(c)">Modifier</button>
            <button @click="remove(c.id!)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useClientStore, type Client } from '../stores/clientStore';

const store = useClientStore();
const { clients } = storeToRefs(store);

const nom = ref('');
const prenom = ref('');
const email = ref('');
const telephone = ref('');

const load = () => store.loadClients();

const onAdd = async () => {
  if (!nom.value.trim()) return;

  await store.addClient({
    nom: nom.value.trim(),
    prenom: prenom.value.trim(),
    email: email.value.trim(),
    telephone: telephone.value.trim(),
  });

  nom.value = '';
  prenom.value = '';
  email.value = '';
  telephone.value = '';
};

const onEdit = async (client: Client) => {
  const nouveauNom = window.prompt('Nom du client :', client.nom) ?? client.nom;
  const nouveauPrenom = window.prompt('Prenom du client :', client.prenom) ?? client.prenom;
  const nouvelEmail = window.prompt('Email du client :', client.email) ?? client.email;
  const nouveauTel =
    window.prompt('Téléphone du client :', client.telephone) ?? client.telephone;

  await store.updateClient({
    ...client,
    nom: nouveauNom.trim(),
    prenom: nouveauPrenom.trim(),
    email: nouvelEmail.trim(),
    telephone: nouveauTel.trim(),
  });
};

const remove = async (id: number) => {
  if (!confirm('Supprimer ce client ?')) return;
  await store.deleteClient(id);
};

onMounted(load);
</script>
