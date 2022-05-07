<script lang="ts">
  import renderMoney from '$lib/renderMoney';
  import type { User } from '$lib/types';
  export let user: User;
</script>

<div class="user">
  <div class="Truncate">
    <p class="Truncate-text h3">{user.userName}</p>
  </div>
  <p>{renderMoney(user.balance)}</p>
</div>
