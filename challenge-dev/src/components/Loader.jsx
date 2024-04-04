import style from  './loader.module.css'
export const Loader=()=>{
    return (

 <div className={style.loader}>
  <div className={style.loaderinner}>
    <div className={style.loaderlinewrap}>
      <div className={style.loaderline}></div>
    </div>
    <div className={style.loaderlinewrap}>
      <div className={style.loaderline}></div>
    </div>
    <div className={style.loaderlinewrap}>
      <div className={style.loaderline}></div>
    </div>
    <div className={style.loaderlinewrap}>
      <div className={style.loaderline}></div>
    </div>
    <div className={style.loaderlinewrap}>
      <div className={style.loaderline}></div>
    </div>
  </div>
</div>
    )
}