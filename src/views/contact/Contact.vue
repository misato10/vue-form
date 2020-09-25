<template>
  <div class="contact">
    <ValidationObserver v-slot="{ handleSubmit }" v-if="!isConfirm">
      <h1>お問い合わせフォーム</h1>
      <div v-if="isFailure">
        <p>申し訳ございませんが、送信に失敗しました。</p>
        <p>しばらくしてもう一度お試しになるか、メールにてご連絡ください。</p>
        <p>ご迷惑をおかけして誠に申し訳ございません。</p>
      </div>
      
      <form @submit.prevent="handleSubmit(onSubmitConfirm)">
        <h2>入力</h2>
        <p>以下のフォームからお問い合わせください。</p>
        <ValidationProvider
          name="name"
          tag="dl"
          class="input__box"
          rules="required"
          v-slot="{ errors }"
        >
          <dt class="input__ttl">お名前</dt>
          <dd class="input__item">
            <input
              type="text"
              id="name"
              name="name"
              maxlength="50"
              v-model="inputName"
            />
            <p>{{ errors[0] }}</p>
          </dd>
        </ValidationProvider>
        <ValidationProvider
          name="email"
          tag="dl"
          class="input__box"
          rules="required|email"
          :bails="false"
          v-slot="{ errors }"
        >
          <dt class="input__ttl">メールアドレス</dt>
          <dd class="input__item">
            <input
              type="email"
              id="email"
              name="email"
              maxlength="100"
              v-model="inputEmail"
            />
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </dd>
        </ValidationProvider>
        <ValidationProvider
          name="inquiry"
          tag="dl"
          class="input__box"
          rules="required"
          :bails="false"
          v-slot="{ errors }"
        >
          <dt class="input__ttl">お問い合わせ内容</dt>
          <dd class="input__item">
            <textarea
              name="inquiry"
              id="inquiry"
              cols="30"
              rows="10"
              v-model="inputInquiry"
            ></textarea>
            <p>{{ errors[0] }}</p>
          </dd>
        </ValidationProvider>

        <input type="submit" value="確認画面へ" />
      </form>
    </ValidationObserver>

    <div class="confirm" v-if="isConfirm">
      <h2>確認</h2>
      <p>以下の内容でよろしければ「送信する」をクリックしてください。<br>内容を変更する場合は「戻る」をクリックして入力画面にお戻りください。</p>
      <form v-on:submit.prevent="onSubmitSend">
        <dl class="confirm__box">
          <dt class="confirm__ttl">お名前</dt>
          <dd class="input__item">{{ inputName }}</dd>
        </dl>
        <dl class="confirm__box">
          <dt class="confirm__ttl">メールアドレス</dt>
          <dd class="input__item">{{ inputEmail }}</dd>
        </dl>
        <dl class="confirm__box">
          <dt class="confirm__ttl">お問い合わせ内容</dt>
          <dd class="input__item">{{ inputInquiry }}</dd>
        </dl>
        <input type="submit" value="送信する" />
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ValidationProvider } from "vee-validate";
import { ValidationObserver } from "vee-validate";
import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "{_field_}は必須です"
});

extend("email", {
  ...email,
  message: "{_field_}は適切ではありません"
});

export default {
  name: "Contact",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      inputName: "",
      inputEmail: "",
      inputInquiry: "",
      isConfirm: false,
      isFailure: false
    };
  },
  methods: {
    
    dataReset() {
      this.inputName = "";
      this.inputEmail = "";
      this.inputInquiry = "";
    },
    onSubmitConfirm() {
      this.isFailure = false;
      this.isConfirm = true;
    },
    onSubmitSend() {
      let _this = this;
      const submitParams = new FormData();

      // お名前のname属性値
      submitParams.append("entry.2114152239", this.inputName);

      // メールアドレスのname属性値
      submitParams.append("entry.2100513332", this.inputEmail);

      // お問い合わせ内容のname属性値
      submitParams.append("entry.1106185731", this.inputInquiry);

      // CORSエラー対策
      const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
      // Googleフォームのaction属性値
      const GOOGLE_FORM_ACTION =
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdHfmgu9P4qojiulONrJFzRRXImzDy7JOn8BT726t0j3_JJFg/formResponse";

      // Ajax POST通信
      axios
        .post(CORS_PROXY + GOOGLE_FORM_ACTION, submitParams)
        .then(res => {
          console.log(res);
          // フォーム非表示
          //this.showForm = false;
          setTimeout(function() {
            if (res.status === 200) {
               _this.$router.push({ name: "Complete" });
            }
          }, 500);
        })
        .catch(error => {
          //this.isSubmitComplete = true
          console.log("response: ", error.response);
          this.isConfirm = false;
          this.isFailure = true;
        });
    }
  }
};
</script>
<style scoped>
.input__box {
  display: flex;
}
.input__ttl {
  width: 150px;
  text-align: left;
}
</style>
