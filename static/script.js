$(document).ready(function() {
    console.log("Document ready");

    if (typeof gScrollNumber === 'undefined') {
        console.error('gScrollNumber is not defined');
        return;
    }

    let scrollNumbers = [];

    function initializeScrollNumbers(length) {
        $('.scroll-container').empty();
        scrollNumbers = [];

        for (let i = 0; i < length; i++) {
            $('.scroll-container').append(`<li class="scroll-number-${i}"></li>`);
            let sn = new gScrollNumber(`.scroll-number-${i}`, {
                width: 60,
                color: "white",
                fontSize: 60,
                autoSizeContainerWidth: true
            });
            scrollNumbers.push(sn);
        }
    }

    function updateDisplays(number) {
        console.log('Updating displays with number:', number);

        if (typeof number !== 'string') {
            console.error('Invalid number data:', number);
            $('#number').text('Invalid Data');
            return;
        }

        $('#number').text(number);

        if (scrollNumbers.length !== number.length) {
            initializeScrollNumbers(number.length);
        }

        for (let i = 0; i < number.length; i++) {
            scrollNumbers[i].run(number[i]);
        }
    }

    function updateDigitalBar(numberAPI) {
        console.log('Updating digital bar with API number:', numberAPI);

        const numbersContainer = document.querySelector('.numbersAPI');
        numbersContainer.innerHTML = '';

        for (let i = 0; i < numberAPI.length; i++) {
            const digitSpan = document.createElement('span');
            digitSpan.className = 'numbers__window';
            const innerSpan = document.createElement('span');
            innerSpan.className = `numbers__window__digit numbers__window__digit--${i + 1}`;
            innerSpan.textContent = numberAPI.charAt(i);
            digitSpan.appendChild(innerSpan);
            numbersContainer.appendChild(digitSpan);
        }
    }

    function fetchApiNumber() {
        console.log('Fetching data from /api_data.json...');
        fetch('/api_data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('API Data received:', data);
    
                if (data && data.numberAPI !== undefined) {
                    updateDigitalBar(data.numberAPI.toString());
                } else {
                    console.error('No API number data found or data is undefined.');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                $('.numbersAPI').text('Error loading data');
            });
    }
    
    function fetchDataAndUpdate() {
        console.log('Fetching data from /data.json...');
        fetch('/data.json')
            .then(response => {
                if (!response.ok) {
                    console.error('Network response was not ok', response.status, response.statusText);
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data);

                if (data && data.number !== undefined) {
                    const numberStr = data.number.toString();
                    updateDisplays(numberStr);
                } else {
                    console.error('No number data found or data is undefined.');
                    $('#number').text('No Data');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                $('#number').text('Error loading data');
            });
    }

    fetchDataAndUpdate();
    fetchApiNumber();

    setInterval(fetchDataAndUpdate, 5000);
    setInterval(fetchApiNumber, 5000);

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-36251023-1']);
    _gaq.push(['_setDomainName', 'jqueryscript.net']);
    _gaq.push(['_trackPageview']);
    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
});
