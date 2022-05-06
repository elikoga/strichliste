<script lang="ts">
  import type { User } from '$lib/db';
  import renderMoney from '$lib/renderMoney';
  export let user: User;
</script>

<div class="user">
  <h2>{user.userName}</h2>
  <p>{renderMoney(user.balance)}</p>
</div>
