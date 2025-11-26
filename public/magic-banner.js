(() => {
    const scriptTag = document.currentScript || document.querySelector('script[src*="magic-banner.js"]');
    const baseUrl = new URL(scriptTag.src).origin;

    const currentUrl = window.location.href;

    fetch(`${baseUrl}/api/banners?url=${encodeURIComponent(currentUrl)}`)
        .then(response => {
            if (!response.ok) throw new Error('No banner');
            return response.json();
        })
        .then(data => {
            if (data && data.image_url) {
                createBanner(data.image_url);
            }
        })
        .catch(err => console.log('Magic Banner: Nenhum banner para exibir ou erro.', err));

    const createBanner = (imageUrl) => {
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '200px';
        div.style.backgroundImage = `url('${imageUrl}')`;
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'center';
        div.style.position = 'relative';
        div.style.zIndex = '9999';
        div.style.cursor = 'pointer';

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'X';
        closeBtn.style.position = 'absolute';
        closeBtn.style.right = '10px';
        closeBtn.style.top = '10px';
        closeBtn.onclick = () => div.remove();

        div.appendChild(closeBtn);

        document.body.prepend(div);
    }
})();
