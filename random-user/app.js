const app = Vue.createApp({
  data() {
    return {
      firstName: 'Akhil',
      lastName: 'Selvakumar',
      gender: 'male',
      email: 'me@akhilselva.in',
      image: 'akhil_ms.jpg'
    }
  },
  methods: {
    async getUser() {
      let userData = await fetch('https://randomuser.me/api');
      let { results } = await userData.json();
      this.firstName = results[0].name.first;
      this.lastName = results[0].name.last;
      this.gender = results[0].gender;
      this.email = results[0].email;
      this.image = results[0].picture.large;
    }
  }
});

app.mount('#app');