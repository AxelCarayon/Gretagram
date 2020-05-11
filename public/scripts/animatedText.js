

$(document).ready (() => {
    const liste = ["propre","meilleur","vivant"]

    let deleting = false
    let i = 0
    let j = 0
    let pause = false
    
    const test = (word) => {
        
        if (deleting) {
            i-- 
        } else {
            i++
        }
    
        if (i == word.length) {
            deleting = true
            pause = true
        } else if (i == 0) {
            deleting = false
    
            if (j == liste.length -1) {
                j = 0
            } else {
                j++
            }
            
        }
    
    
    
        $('#textAnim').text(word.slice(0,i));
        if (pause) {
            pause = false
            setTimeout((i) => {
                test(liste[j])
            }, 2000)
        } else {
            setTimeout(() => {
                test(liste[j])
                
            }, 50)
        }
    
    }
    
    test(liste[j])
})
