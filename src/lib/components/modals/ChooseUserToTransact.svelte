<script lang="ts">
  import BaseModal from './BaseModal.svelte';

  import { closeModal, openModal } from 'svelte-modals';
  import UserPreview from '../UserPreview.svelte';
  import renderMoney from '$lib/renderMoney';
  import assert from 'assert';
  import ErrorModal from './Error.svelte';
  import { createTransaction, getAllUsers, getUserById } from '$lib/api';
  import type { User } from '$lib/types';
  import Button from '../Button.svelte';

  import { _ } from 'svelte-i18n';
  import People24 from 'svelte-octicons/lib/People24.svelte';
  import PersonAdd16 from 'svelte-octicons/lib/PersonAdd16.svelte';
  import CreateUser from './CreateUser.svelte';

  // provided by <Modals />
  export let isOpen: boolean;

  export let amount: number;
  export let fromUser: User;

  let allUsersPromise: Promise<User[]> = getAllUsers().then((users) =>
    users.filter((user) => user.id !== fromUser.id)
  );

  const send = async (toUser: User) => {
    try {
      await createTransaction(fromUser.id, toUser.id, amount);
      closeModal();
    } catch (e: any) {
      openModal(ErrorModal, { message: e.message });
    }
  };

  const createUser = () => {
    openModal(CreateUser, {
      next: async (uid) => {
        const user = await getUserById(uid);
        assert(user, 'User not found');
        send(user);
      }
    });
  };
</script>

<BaseModal
  {isOpen}
  title={$_('transaction.send', {
    values: { username: fromUser.userName, amount: renderMoney(amount) }
  })}
>
  <div class="d-flex flex-wrap">
    {#await allUsersPromise}
      <span>Loading</span><span class="AnimatedEllipsis" />
    {:then allUsers}
      {#each allUsers as user}
        <Button
          class="flex-auto"
          on:click={() => {
            closeModal();
            send(user);
          }}
        >
          <UserPreview {user} />
        </Button>
      {:else}
        <div class="blankslate">
          <People24 class="blankslate-image" />
          <h3 class="blankslate-heading">{$_('users.noUsers')}</h3>
          <p>
            {$_('users.noUsersDescription')}
          </p>
          <div class="blankslate-action">
            <Button class="ml-2 mt-2 btn-primary" on:click={createUser}>
              <PersonAdd16 />
              <span>{$_('button.createUser')}</span>
            </Button>
          </div>
        </div>
      {/each}
    {/await}
  </div>
  <svelte:fragment slot="actions">
    <Button on:click={closeModal}>{$_('button.cancel')}</Button>
  </svelte:fragment>
</BaseModal>
