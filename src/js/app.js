function key() {
    var d = new Date()
    return (`${d.getDay()}${d.getDate()}${d.getMonth()+1}${d.getFullYear()}`)
}

var Data=""
var cooldown=false

function initApp() {
    $("#submit").click(async()=>{
        cooldown=true
        if ($("#textUpload").val().trim().length < 5) {
            $(".alert").text("Vui lòng nhập xâu hơn 5 ký tự!")
        }else{
            await fetch('https://6493949d0da866a9536686e2.mockapi.io/clipboard', {
            method: 'POST',
            headers: {'content-type':'application/json'},
            body: JSON.stringify({"text": $("#textUpload").val().trim()})
        }).then(res => {
            if (res.ok) {
                return res.json();  
            }}).then(tasks => { 
                $(".alert").text("Đã tải lên thành công!")
                initDisplay()
            }).catch(error => {
                alert("LỖI TẢI LÊN THÔNG TIN")
                $("#textUpload").val()=""
            })
        }
        setTimeout(()=>{
            cooldown=false;
        },5000)
    })

}

async function initDisplay() {
    await fetch('https://6493949d0da866a9536686e2.mockapi.io/clipboard', {
            method: 'GET',
            headers: {'content-type':'application/json'},
        }).then(res => {
            if (res.ok) {
                return res.json();
            }}).then(tasks => { 
                Data = tasks
                var html =""          
                for (let i=tasks.length-1;i>=0;i--){
                    html+=
                    `<div class="boxContent">
                    <div class="toolBox">
                        <i class="fa-solid fa-copy copyCmd"></i>
                        <i class="fa-solid fa-trash delCmd"></i>
                    </div>
                    <pre>${escapeHTML(tasks[i]["text"].trim())}</pre> 
                </div>`
                }
                $("#display").html(html)
            }).catch(error => {
                alert("LỖI LẤY THÔNG TIN")
            })
    $("#textUpload").val("")
    for (let i=0;i<Data.length;i++) {
        $(".copyCmd").eq(i).click(()=>{
            navigator.clipboard.writeText(Data[i]["text"])
            alert("Đã sao chép!")
        })

        $(".delCmd").eq(i).click(async ()=>{
            console.log(i)
            await fetch('https://6493949d0da866a9536686e2.mockapi.io/clipboard/'+Data[i]["id"], {
                method: 'DELETE',
            }).then(res => {
                if (res.ok) {
                    return res.json();
                }}).then(tasks => {
                    initDisplay()
                    $(".alert").val("Xóa thành công!")
                }).catch(error => {
                    alert("LỖI XÓA THÔNG TIN")
                })
        })
    }            
}

$(document).ready(async ()=>{
    $("#login").click(async ()=>{
        // var text=$("#pass").val().trim()
        // $("#overlay").fadeOut();
        initApp()    
        initDisplay()    
    })

})

// CHAT GPT

function escapeHTML(str) {
    const map = {
      '<': '&lt;',
      '>': '&gt;',
      '`': '&#96;',
      '"': '&quot;',
      "'": '&#39;',
      '$': '&#36;',
      '&': '&amp;',
      '(': '&#40;',
      ')': '&#41;'
    };  
    return str.replace(/[<>'"`$&()]/g, function(matched) {
      return map[matched];
    });
  }
  