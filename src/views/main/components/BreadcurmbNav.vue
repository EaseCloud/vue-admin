<template>
  <breadcrumb>
    <breadcrumb-item
      v-for="item in currentPath"
      :href="item.path"
      :key="item.name"
    >{{utils.html.i18nText(item.title)}}
    </breadcrumb-item>
  </breadcrumb>
</template>

<script>
  export default {
    name: 'BreadcrumbNav',
    props: {
      currentPath: Array
    }
  }
</script>
