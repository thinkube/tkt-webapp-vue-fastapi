<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">{{ t('apiTokens.title') }}</h1>
    
    <!-- Create Token Form -->
    <div class="card bg-base-200 shadow-xl mb-6">
      <div class="card-body">
        <h2 class="card-title">{{ t('apiTokens.createToken.title') }}</h2>
        <fieldset class="fieldset">
          <label class="label" for="token-name">{{ t('apiTokens.createToken.nameLabel') }}</label>
          <input 
            id="token-name"
            v-model="newToken.name" 
            type="text" 
            :placeholder="t('apiTokens.createToken.namePlaceholder')" 
            class="input"
          />
        </fieldset>
        <fieldset class="fieldset">
          <label class="label" for="token-expires">{{ t('apiTokens.createToken.expiresLabel') }}</label>
          <input 
            id="token-expires"
            v-model.number="newToken.expires_in_days" 
            type="number" 
            :placeholder="t('apiTokens.createToken.expiresPlaceholder')" 
            class="input"
          />
        </fieldset>
        <div class="card-actions justify-end mt-4">
          <button 
            @click="createToken" 
            class="btn btn-primary"
            :disabled="!newToken.name"
          >
            {{ t('apiTokens.createToken.createButton') }}
          </button>
        </div>
      </div>
    </div>

    <!-- New Token Display -->
    <div v-if="createdToken" class="alert alert-success shadow-lg mb-6">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="font-bold">{{ t('apiTokens.tokenCreated.title') }}</h3>
          <p class="text-sm">{{ t('apiTokens.tokenCreated.message') }}</p>
          <div class="mockup-code mt-2">
            <pre><code>{{ createdToken.token }}</code></pre>
          </div>
          <button @click="copyToken" class="btn btn-sm btn-ghost mt-2" title="Copy to clipboard">
            {{ t('apiTokens.tokenCreated.copyButton') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Token List -->
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{{ t('apiTokens.tokenList.title') }}</h2>
        <div v-if="tokenStore.loading" class="text-center py-4">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        <div v-else-if="tokenStore.tokens.length === 0" class="text-center py-4">
          <p>{{ t('apiTokens.tokenList.noTokens') }}</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>{{ t('apiTokens.tokenList.table.name') }}</th>
                <th>{{ t('apiTokens.tokenList.table.created') }}</th>
                <th>{{ t('apiTokens.tokenList.table.expires') }}</th>
                <th>{{ t('apiTokens.tokenList.table.lastUsed') }}</th>
                <th>{{ t('apiTokens.tokenList.table.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="token in tokenStore.tokens" :key="token.id" data-testid="token-card">
                <td>{{ token.name }}</td>
                <td>{{ formatDate(token.created_at) }}</td>
                <td>{{ token.expires_at ? formatDate(token.expires_at) : t('apiTokens.tokenList.table.never') }}</td>
                <td>{{ token.last_used ? formatDate(token.last_used) : t('apiTokens.tokenList.table.never') }}</td>
                <td>
                  <button 
                    @click="revokeToken(token.id)" 
                    class="btn btn-sm btn-error"
                    :disabled="!token.is_active"
                  >
                    {{ token.is_active ? t('apiTokens.tokenList.table.revoke') : t('apiTokens.tokenList.table.revoked') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Usage Instructions -->
    <div class="card bg-base-200 shadow-xl mt-6">
      <div class="card-body">
        <h2 class="card-title">{{ t('apiTokens.usage.title') }}</h2>
        <div class="prose">
          <h3>{{ t('apiTokens.usage.vscode.title') }}</h3>
          <p>{{ t('apiTokens.usage.vscode.description') }}</p>
          <pre><code>{
  "thinkube-cicd.apiToken": "tk_your_token_here"
}</code></pre>
          
          <h3>{{ t('apiTokens.usage.cli.title') }}</h3>
          <p>{{ t('apiTokens.usage.cli.description') }}</p>
          <pre><code>curl -H "Authorization: Bearer tk_your_token_here" \
  https://control.thinkube.com/api/v1/cicd/pipelines</code></pre>
          
          <h3>{{ t('apiTokens.usage.mcp.title') }}</h3>
          <p>{{ t('apiTokens.usage.mcp.description') }}</p>
          <pre><code>export THINKUBE_API_TOKEN="tk_your_token_here"</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTokenStore } from '@/stores/tokens'

const { t } = useI18n()
const tokenStore = useTokenStore()

const newToken = ref({
  name: '',
  expires_in_days: null,
  scopes: []
})
const createdToken = ref(null)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const createToken = async () => {
  // Validate token name
  if (!newToken.value.name || newToken.value.name.trim() === '') {
    alert(t('apiTokens.errors.nameMissing'))
    return
  }
  
  try {
    createdToken.value = await tokenStore.createToken(newToken.value)
    newToken.value = { name: '', expires_in_days: null, scopes: [] }
  } catch (error) {
    console.error('Failed to create token:', error)
    alert(t('apiTokens.errors.createFailed'))
  }
}

const revokeToken = async (tokenId) => {
  if (!confirm(t('apiTokens.tokenList.confirmRevoke'))) {
    return
  }
  
  try {
    await tokenStore.revokeToken(tokenId)
  } catch (error) {
    console.error('Failed to revoke token:', error)
    alert(t('apiTokens.errors.revokeFailed'))
  }
}

const copyToken = () => {
  navigator.clipboard.writeText(createdToken.value.token)
  alert(t('apiTokens.tokenCreated.copied'))
}

onMounted(async () => {
  await tokenStore.fetchTokens()
})
</script>

<!-- 🤖 Generated with Claude -->